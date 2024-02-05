import { TileInfo, tilemap } from '../images/tilemap'
import { loadImages } from './image_loader'

function calculateTexCoords (
  x: number,
  y: number,
  w: number,
  h: number,
  textureWidth: number,
  textureHeight: number
): number[] {
  const left = x / textureWidth
  const right = (x + w) / textureWidth
  const top = y / textureHeight
  const bottom = (y + h) / textureHeight

  return [
    left,
    bottom,
    right,
    bottom,
    left,
    top,
    right,
    bottom,
    right,
    top,
    left,
    top
  ]
}

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
  attribute vec3 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  uniform vec2 u_resolution;
  uniform float u_time;

  void main() {
    vec2 position = vec2(1.0, -1.0) * a_position.xy * vec2(u_resolution.y/u_resolution.x, 1.0);
    vec2 delta = vec2(sin(u_time), 0.0);
    
    // vec2 delta = vec2(0.0, 0.0);
    float z = a_position.z + 3.0;
    vec2 finalPos = position + delta;
    gl_Position = vec4(finalPos, 1.0, z);
    v_texCoord = a_texCoord;
  }
`

const fragmentShader1: string = `
  precision mediump float;
  varying vec2 v_texCoord;
  uniform sampler2D u_texture;

  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    // gl_FragColor = texture2D(u_texture, v_texCoord, 0.0);
  }
`
// Define vertex and fragment shaders
const vertexShader2: string = `
  precision mediump float;
  attribute vec3 a_position2;
  attribute vec2 a_texCoord2;
  varying vec2 v_texCoord2;
  uniform vec2 u_resolution2;
  uniform float u_time2;

  void main() {
    vec2 position = vec2(1.0, -1.0) * a_position2.xy; // * vec2(u_resolution2.y/u_resolution2.x, 1.0)
    //vec2 delta = vec2(sin(u_time2), 0.0);
    
    // vec2 delta = vec2(0.0, 0.0);
    float z = 1.0;
    // vec2 finalPos = position + delta;
    gl_Position = vec4(position, 1.0, z);
    v_texCoord2 = a_texCoord2;
  }
`

const fragmentShader2: string = `
  precision mediump float;
  varying vec2 v_texCoord2;
  uniform sampler2D u_texture2;
  uniform vec2 u_resolution2;

  void main() {
    // gl_FragColor = texture2D(u_texture, v_texCoord2, 0.0);
    // Calculate normalized coordinates
    vec2 u_gridSize = vec2(10.0, 10.0 * vec2(u_resolution2.y/u_resolution2.x, 1.0));
    vec2 uv = gl_FragCoord.xy / u_resolution2;

    // Calculate grid coordinates
    vec2 gridCoords = uv * u_gridSize;

    // Use modulus to create grid lines
    float isGridLineX = mod(gridCoords.x, 1.0);
    float isGridLineY = mod(gridCoords.y, 1.0);

    float isLine = smoothstep(0.96, 0.98, max(isGridLineX, isGridLineY));
    gl_FragColor = vec4(1.0, 1.0, 1.0, isLine);
  }
`

export const bindTexture = (
  gl: WebGLRenderingContext,
  texture: HTMLImageElement
) => {
  const gltexture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, gltexture)

  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture)

  gl.generateMipmap(gl.TEXTURE_2D)
  gl.texParameteri(
    gl.TEXTURE_2D,
    gl.TEXTURE_MIN_FILTER,
    gl.NEAREST_MIPMAP_NEAREST
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

const resizeCanvas = (canvas: HTMLCanvasElement) => {
  const pixelRatio = window.devicePixelRatio || 1
  canvas.width = canvas.clientWidth * pixelRatio
  canvas.height = canvas.clientHeight * pixelRatio
}

export const initCanvasResizeListener = (canvas: HTMLCanvasElement) => {
  let resizeTimeout: NodeJS.Timeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      resizeCanvas(canvas)
    }, 200)
  })

  resizeCanvas(canvas)
}

const initialiseBlockShader = (
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement
) => {
  const shaderProgram: WebGLProgram = createShaderProgram(
    gl,
    vertexShader1,
    fragmentShader1
  )

  gl.useProgram(shaderProgram)

  // initialise resolution
  const resolution: number[] = [canvas.width, canvas.height]

  const resolutionUniformLocation = gl.getUniformLocation(
    shaderProgram,
    'u_resolution'
  )
  gl.uniform2fv(resolutionUniformLocation, resolution)

  // 0 = active texture (we currently only have one)
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'u_texture'), 0)

  const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time')

  const positionAttributeLocation: number = gl.getAttribLocation(
    shaderProgram,
    'a_position'
  )

  console.log('block', { positionAttributeLocation, shaderProgram })

  const positionBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

  let vertexCount = 0
  const updateVertexPositions = (positions: number[]) => {
    vertexCount = positions.length

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
  }

  const updateTextureCoordinates = (texCoords: number[]) => {
    const texCoordBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
    const texCoordAttributeLocation: number = gl.getAttribLocation(
      shaderProgram,
      'a_texCoord'
    )
    gl.enableVertexAttribArray(texCoordAttributeLocation)
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)
  }

  return {
    update: (timeInSeconds: number) => {
      gl.uniform1f(timeUniformLocation, timeInSeconds)
      gl.uniform2fv(resolutionUniformLocation, [
        canvas.clientWidth,
        canvas.clientHeight
      ])

      gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
    },
    updateVertexPositions,
    updateTextureCoordinates,
    use: () => gl.useProgram(shaderProgram)
  }
}

const initialiseBackgroundShader = (
  gl: WebGLRenderingContext,
  canvas: HTMLCanvasElement
) => {
  const shaderProgram: WebGLProgram = createShaderProgram(
    gl,
    vertexShader2,
    fragmentShader2
  )

  gl.useProgram(shaderProgram)

  // initialise resolution
  const resolution: number[] = [canvas.width, canvas.height]

  const resolutionUniformLocation = gl.getUniformLocation(
    shaderProgram,
    'u_resolution'
  )
  gl.uniform2fv(resolutionUniformLocation, resolution)

  // 0 = active texture (we currently only have one)
  gl.uniform1i(gl.getUniformLocation(shaderProgram, 'u_texture2'), 0)

  const timeUniformLocation = gl.getUniformLocation(shaderProgram, 'u_time2')

  const positionAttributeLocation: number = gl.getAttribLocation(
    shaderProgram,
    'a_position2'
  )

  console.log('back', { positionAttributeLocation, shaderProgram })

  const positionBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)

  let vertexCount = 0
  const updateVertexPositions = (positions: number[]) => {
    vertexCount = positions.length

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0)
  }

  const updateTextureCoordinates = (texCoords: number[]) => {
    const texCoordBuffer: WebGLBuffer = gl.createBuffer() as WebGLBuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW)
    const texCoordAttributeLocation: number = gl.getAttribLocation(
      shaderProgram,
      'a_texCoord2'
    )
    gl.enableVertexAttribArray(texCoordAttributeLocation)
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0)
  }

  return {
    update: (timeInSeconds: number) => {
      gl.uniform1f(timeUniformLocation, timeInSeconds)
      gl.uniform2fv(resolutionUniformLocation, [
        canvas.clientWidth,
        canvas.clientHeight
      ])

      gl.drawArrays(gl.TRIANGLES, 0, vertexCount)
    },
    updateVertexPositions,
    updateTextureCoordinates,
    use: () => gl.useProgram(shaderProgram)
  }
}

const initiliaseWebglCanvas = (
  canvas: HTMLCanvasElement,
  textureAtlas: HTMLImageElement
) => {
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

  // block shader programs ==================================================

  const blockShaderProgram = initialiseBlockShader(gl, canvas)
  const backgroundShaderProgram = initialiseBackgroundShader(gl, canvas)

  gl.viewport(0, 0, canvas.width, canvas.height)

  // support transparency
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

  bindTexture(gl, textureAtlas)

  return {
    gl,
    blockShaderProgram,
    backgroundShaderProgram
  }
}

export const webglCanvas = async () => {
  const canvas: HTMLCanvasElement = document.getElementById(
    'canvas'
  )! as HTMLCanvasElement

  const images = await loadImages()

  const textureAtlas: HTMLImageElement = images.get('combinedImage')!

  const {
    gl,
    blockShaderProgram,
    backgroundShaderProgram
  } = initiliaseWebglCanvas(canvas, textureAtlas)

  // create texture coordinates

  const getTextureFromTileset = (name: string) => {
    const tileInfo: TileInfo = tilemap[name]
    return calculateTexCoords(
      tileInfo.x,
      tileInfo.y,
      tileInfo.w,
      tileInfo.h,
      textureAtlas.width,
      textureAtlas.height
    )
  }

  gl.clearColor(0.0706, 0.3569, 0.6549, 1.0)

  {
    // block shader
    blockShaderProgram.use()
    const depth = 2
    const positions: number[] = []
    const texCoords: number[] = []
    positions.push(
      ...calculateVertexCoords(-1, -0.5, 1, 1, depth + 1),
      ...calculateVertexCoords(0, -0.5, 1, 1, depth + 1),
      ...calculateVertexCoords(-0.5, -0.5, 1, 1, depth)
    )
    texCoords.push(
      ...getTextureFromTileset('target_block'),
      ...getTextureFromTileset('lime_wool'),
      ...getTextureFromTileset('glass')
    )

    blockShaderProgram.updateVertexPositions(positions)

    blockShaderProgram.updateTextureCoordinates(texCoords)
  }

  {
    // backgroundShaderProgram
    backgroundShaderProgram.use()
    const positions: number[] = []
    const texCoords: number[] = []
    positions.push(...calculateVertexCoords(-1, -1, 2, 2, 1))
    texCoords.push(...getTextureFromTileset('glass'))

    // positions.push(
    //   ...calculateVertexCoords(-1, -1, 2, 2, 1),
    //   ...calculateVertexCoords(0, -0.5, 1, 1, -1),
    //   ...calculateVertexCoords(-0.5, -0.5, 1, 1, -1)
    // )
    // texCoords.push(
    //   ...getTextureFromTileset('target_block'),
    //   ...getTextureFromTileset('lime_wool'),
    //   ...getTextureFromTileset('glass')
    // )

    backgroundShaderProgram.updateVertexPositions(positions)

    backgroundShaderProgram.updateTextureCoordinates(texCoords)
  }

  const update = (time: number) => {
    const timeInSeconds = time / 1000

    gl.clear(gl.COLOR_BUFFER_BIT)

    blockShaderProgram.use()
    blockShaderProgram.update(timeInSeconds)

    backgroundShaderProgram.use()
    backgroundShaderProgram.update(timeInSeconds)

    requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}
