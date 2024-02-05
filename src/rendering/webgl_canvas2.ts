import { StringDict } from '../containers/array2d'
import { strToVec, Vec2 } from '../containers/vec2'
import { Block, BlockState } from '../core/block'
import { loadWorldSave } from '../core/world_loading'
import { createBlock } from '../utils/create_block'

function calculateVertexCoords (
  x: number,
  y: number,
  w: number,
  h: number,
  d: number
): number[] {
  const left = x
  const right = x + w
  const top = y
  const bottom = y + h
  const depth = d

  return [
    left,
    bottom,
    depth,
    right,
    bottom,
    depth,
    left,
    top,
    depth,
    right,
    bottom,
    depth,
    right,
    top,
    depth,
    left,
    top,
    depth
  ]
}

function createShaderProgram (
  gl: WebGLRenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string
) {
  const vertexShader: WebGLShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
  )
  const fragmentShader: WebGLShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  )

  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      'Shader program failed to link: ',
      gl.getProgramInfoLog(program)
    )
  }

  return program
}

function createShader (
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader: WebGLShader = gl.createShader(type) as WebGLShader
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null as never
  }

  return shader
}

// Define vertex and fragment shaders
const vertexShader1: string = `
  attribute vec3 a_position1;

  void main() {
    gl_Position = vec4(a_position1.xy, 1.0, a_position1.z);
  }
`

const fragmentShader1: string = `
  precision mediump float;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
  }
`

const vertexShader2: string = `
  attribute vec3 a_position2;

  void main() {
    gl_Position = vec4(a_position2.xy, 1.0, a_position2.z);
  }
`

const fragmentShader2: string = `
  precision mediump float;

  void main() {
    // float r = gl_FragCoord.x / 636.0;
    float gridSize = 32.0;
    float r = step(gridSize - 1.0, mod(gl_FragCoord.x, gridSize)) * gl_FragCoord.x / 636.0;
    float g = step(gridSize - 1.0, mod(gl_FragCoord.y, gridSize)) * gl_FragCoord.y / 457.0;
    float a = step(gridSize - 1.0, max(mod(gl_FragCoord.x, gridSize), mod(gl_FragCoord.y, gridSize)));
    gl_FragColor = vec4(r, g, 0.0, a);
  }
`

const initialiseShader = (
  gl: WebGLRenderingContext,
  vertexShader: string,
  fragmentShader: string
) => {
  const shaderProgram: WebGLProgram = createShaderProgram(
    gl,
    vertexShader,
    fragmentShader
  )

  const positionAttributeLocation: number = gl.getAttribLocation(
    shaderProgram,
    'a_position'
  )

  const state = {
    vertexCount: 0
  }

  const render = () => {
    gl.useProgram(shaderProgram)

    gl.drawArrays(gl.TRIANGLES, 0, state.vertexCount)

    gl.disableVertexAttribArray(positionAttributeLocation)
  }

  const update = (positions: number[]) => {
    gl.useProgram(shaderProgram)
    const positionBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionAttributeLocation)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
    state.vertexCount = positions.length
  }

  return { render, update, program: shaderProgram }
}

const test = (
  gl: WebGLRenderingContext,
  shaderProgram1: WebGLProgram,
  shaderProgram2: WebGLProgram,
  positions1: number[],
  positions2: number[]
) => {
  // update positions 1
  gl.useProgram(shaderProgram1)

  const positionAttributeLocation1: number = gl.getAttribLocation(
    shaderProgram1,
    'a_position1'
  )

  const positionBuffer1: WebGLBuffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer1)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions1), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation1)
  gl.vertexAttribPointer(positionAttributeLocation1, 3, gl.FLOAT, false, 0, 0)

  // render  1
  gl.useProgram(shaderProgram1)

  gl.drawArrays(gl.TRIANGLES, 0, positions1.length)

  // update positions 2
  gl.useProgram(shaderProgram2)

  const positionAttributeLocation2: number = gl.getAttribLocation(
    shaderProgram2,
    'a_position2'
  )

  const positionBuffer2: WebGLBuffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer2)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions2), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation2)
  gl.vertexAttribPointer(positionAttributeLocation2, 3, gl.FLOAT, false, 0, 0)

  // render  2
  gl.useProgram(shaderProgram2)

  gl.drawArrays(gl.TRIANGLES, 0, positions2.length)
}

const initiliaseWebglCanvas = (canvas: HTMLCanvasElement) => {
  // size canvas
  const pixelRatio = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * pixelRatio
  canvas.height = canvas.clientHeight * pixelRatio

  // Get the WebGL rendering context
  const gl: WebGL2RenderingContext = canvas.getContext('webgl2')!

  if (!gl) {
    console.error(
      'Unable to initialize WebGL. Your browser may not support it.'
    )
  }

  gl.clearColor(0.5, 0.5, 0.5, 1.0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  // const p1 = initialiseShader(gl, vertexShader1, fragmentShader1)
  // const p2 = initialiseShader(gl, vertexShader2, fragmentShader2)

  const shaderProgram1: WebGLProgram = createShaderProgram(
    gl,
    vertexShader1,
    fragmentShader1
  )

  const shaderProgram2: WebGLProgram = createShaderProgram(
    gl,
    vertexShader2,
    fragmentShader2
  )

  // p1.update(calculateVertexCoords(-1, -0.5, 1, 1, 5))

  // p2.update(calculateVertexCoords(1, -0.5, 1, 1, 3))

  // p2.render()

  // p1.render()
  console.log(canvas.width, canvas.height)
  test(
    gl,
    shaderProgram1,
    shaderProgram2,
    calculateVertexCoords(-1, -0.5, 1, 1, 5),
    calculateVertexCoords(-1, -1, 2, 2, 2)
  )
}

export const webglCanvas3 = async () => {
  const canvas: HTMLCanvasElement = document.getElementById(
    'canvas'
  )! as HTMLCanvasElement

  const rawBlocks: StringDict<BlockState> = await loadWorldSave()

  const blocks: [Vec2, Block][] = []
  for (const [vs, block] of Object.entries(rawBlocks)) {
    blocks.push([strToVec(vs), createBlock(block.type, block)])
  }

  console.log(blocks)

  initiliaseWebglCanvas(canvas)
}
