import fs from 'fs'
import Jimp from 'jimp'
import path from 'path'
import sharp, { Blend } from 'sharp'
import { sleep } from '../utils/general'

interface ImageConfig {
  isDirectional: boolean
}

const imageConfigs: { [key: string]: ImageConfig } = {
  // must be first
  extension_complete: {
    isDirectional: true
  },
  extension_pending: {
    isDirectional: true
  },
  retraction_complete: {
    isDirectional: true
  },
  retraction_pending: {
    isDirectional: true
  },
  // others
  glass: {
    isDirectional: false
  },
  obsidian: {
    isDirectional: false
  },
  target_block: {
    isDirectional: false
  },
  piston_head: {
    isDirectional: true
  },
  piston_head_retracting: {
    isDirectional: true
  },
  piston_head_extending: {
    isDirectional: true
  },
  piston_on: {
    isDirectional: true
  },
  piston_off: {
    isDirectional: true
  },
  piston_off_extended: {
    isDirectional: true
  },
  sticky_piston_head: {
    isDirectional: true
  },
  sticky_piston_head_retracting: {
    isDirectional: true
  },
  sticky_piston_head_extending: {
    isDirectional: true
  },
  sticky_piston_off: {
    isDirectional: true
  },
  sticky_piston_off_extended: {
    isDirectional: true
  },
  redstone_block: {
    isDirectional: false
  },
  redstone_lamp_on: {
    isDirectional: false
  },
  redstone_torch_on: {
    isDirectional: true
  },
  redstone_lamp_off: {
    isDirectional: false
  },
  redstone_torch_off: {
    isDirectional: true
  },
  lever_on: {
    isDirectional: false
  },
  lever_off: {
    isDirectional: false
  },
  button_on: {
    isDirectional: false
  },
  button_off: {
    isDirectional: false
  },
  observer_on: {
    isDirectional: true
  },
  observer_off: {
    isDirectional: true
  },
  redstone_repeater_base: {
    isDirectional: true
  },
  redstone_repeater_locked: {
    isDirectional: true
  },
  comparator_base: {
    isDirectional: true
  },
  comparator_subtract_on: {
    isDirectional: true
  },
  comparator_subtract_off: {
    isDirectional: true
  },
  comparator_add_on: {
    isDirectional: true
  },
  comparator_add_off: {
    isDirectional: true
  },
  junction: {
    isDirectional: false
  },
  junction_on_horizontal: {
    isDirectional: false
  },
  junction_on_vertical: {
    isDirectional: false
  },
  redstone_cauldron: {
    isDirectional: false
  },
  sign: {
    isDirectional: false
  },
  oak_sapling: {
    isDirectional: false
  },
  oak_log: {
    isDirectional: false
  },
  oak_leaves: {
    isDirectional: false
  },
  cross: {
    isDirectional: false
  },
  dirt: {
    isDirectional: false
  },
  command_block: {
    isDirectional: false
  }
}

async function deletePngFiles (directoryPath: string): Promise<void> {
  try {
    // Ensure the directory exists
    const stats = await fs.promises.stat(directoryPath)
    if (!stats.isDirectory()) {
      throw new Error('Provided path is not a directory')
    }

    // Read the contents of the directory
    const files = await fs.promises.readdir(directoryPath)

    // Filter and delete PNG files
    const pngFiles = files.filter(
      file => path.extname(file).toLowerCase() === '.png'
    )
    const deletionPromises = pngFiles.map(file =>
      fs.promises.unlink(path.join(directoryPath, file))
    )

    await Promise.all(deletionPromises)

    // console.log(`PNG files in '${directoryPath}' deleted successfully.`)
  } catch (error) {
    console.error('Error deleting PNG files:', error)
  }
}

const createRepeaterTextureNames = () => {
  const texs: string[] = []
  for (let i = 4; i > 0; i--) {
    for (let j = 0; j <= i; j++) {
      texs.push(`redstone_repeater_on_${i - j}_off_${j}`)
      if (i - j > 0 && j > 0) {
        texs.push(`redstone_repeater_on_${i - j}_off_${j}_powered`)
      }
    }
  }
  return texs
}

for (let i = 1; i < 16; i += 2) {
  imageConfigs[`redstone_cauldron_on_${i}`] = {
    isDirectional: false
  }
}

createRepeaterTextureNames().map(name => {
  imageConfigs[name] = {
    isDirectional: true
  }
})

const colors: string[] = [
  'white',
  'orange',
  'magenta',
  'light_blue',
  'yellow',
  'lime',
  'pink',
  'gray',
  'light_gray',
  'cyan',
  'purple',
  'blue',
  'brown',
  'green',
  'red',
  'black'
]

colors.map(color => {
  imageConfigs[`${color}_wool`] = {
    isDirectional: false
  }
  imageConfigs[`${color}_concrete_powder`] = {
    isDirectional: false
  }
})

enum RotationDirection {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left'
}

const directions: RotationDirection[] = [
  RotationDirection.Up,
  RotationDirection.Right,
  RotationDirection.Down,
  RotationDirection.Left
]

async function processImagesInDirectory (
  inputDirectory: string,
  outputDirectory: string
): Promise<void> {
  // Read all files in the input directory
  // const files = fs.readdirSync(inputDirectory)

  // Process each image file
  for (const name of Object.keys(imageConfigs)) {
    console.log(name, imageConfigs[name])
    // const inputImagePath = path.join(inputDirectory, file)
    await rotateAndSaveImages(inputDirectory, outputDirectory, name)
  }
}

async function combineImages (
  imagePath1: string,
  imagePath2: string
): Promise<sharp.Sharp> {
  // Read the images
  const image1 = await sharp(imagePath1).toBuffer()
  const image2 = await sharp(imagePath2).toBuffer()

  // Ensure both images have the same dimensions
  const metadata1 = await sharp(image1).metadata()
  const metadata2 = await sharp(image2).metadata()

  if (
    metadata1.width !== metadata2.width ||
    metadata1.height !== metadata2.height
  ) {
    throw new Error('Images must have the same dimensions')
  }

  // Create a new buffer for the combined image
  const combinedImage = Buffer.alloc(metadata1.width! * metadata1.height! * 4)

  // Composite the images on top of each other

  const result = sharp(image1).composite([{ input: image2, blend: 'over' }])

  // result.copy(combinedImage)

  // Save the combined image
  return result
  // await sharp(combinedImage, {
  //   raw: { width: metadata1.width!, height: metadata1.height!, channels: 4 }
  // })
}

async function combineImageList (
  imagePaths: string[],
  blend: Blend = 'over'
): Promise<sharp.Sharp> {
  if (imagePaths.length === 0) {
    throw new Error('no images to combine')
  } else if (imagePaths.length === 1) {
    return await sharp(imagePaths[0])
  }

  // Read the images
  const images: Buffer[] = await Promise.all(
    imagePaths.map(async path => await sharp(path).toBuffer())
  )

  const metadatas = await Promise.all(
    images.map(async image => await sharp(image).metadata())
  )

  const metadata1 = metadatas[0]
  const haveMatchingDimensions = metadatas.slice(1).every(metadata => {
    return (
      metadata.width === metadata1.width && metadata.height === metadata1.height
    )
  })

  if (!haveMatchingDimensions) {
    throw new Error(`Images must have the same dimensions. ${imagePaths}`)
  }

  const overlayOptions: sharp.OverlayOptions[] = images.slice(1).map(image => {
    return { input: image, blend }
  })

  const result = sharp(images[0]).composite(overlayOptions)

  return result
}

async function rotateAndSaveImages (
  inputFolder: string,
  outputFolder: string,
  filename: string
): Promise<void> {
  // const originalFileName = path.basename(
  //   inputImagePath,
  //   path.extname(inputImagePath)
  // )

  // if (!(originalFileName in imageConfigs)) {
  //   console.log(`${originalFileName} not in config`)
  //   return
  // }

  const config = imageConfigs[filename]

  // Load the input image
  const inputImagePath = path.join(inputFolder, filename + '.png')
  const image = sharp(inputImagePath)

  // Define rotation directions

  if (!config.isDirectional) {
    const outputFileName = `${filename}.png`
    const outputPath = path.join(outputFolder, outputFileName)
    await saveImage(image, outputPath)
  } else {
    // Perform rotation and save for each direction
    for (const direction of directions) {
      const rotatedImage = await rotateImage(image, direction)
      const outputFileName = `${filename}_${direction}.png`
      const outputPath = path.join(outputFolder, outputFileName)
      await saveImage(rotatedImage, outputPath)
    }
  }

  // if (config.isMoveable) {
  //   await handleOverlayImage(outputFolder, filename, config.isDirectional)
  // }

  // if (config.canFall) {
  //   await handleFallingBlockImages(outputFolder, filename, config.isDirectional)
  // }
}

const movementStates = [
  'extension_complete',
  'extension_pending',
  'retraction_complete',
  'retraction_pending'
]
const gravityStates = ['falling', 'fallen']

async function handleFallingBlockImages (
  outputFolder: string,
  originalFileName: string,
  isDirectional: boolean
) {
  const execute = async (
    state: string,
    rotationDirection: RotationDirection | null
  ) => {
    const overlayFileName = state + '.png'
    const overlayPath = path.join(outputFolder, overlayFileName)
    const underlayFileName =
      [originalFileName, rotationDirection].filter(x => x != null).join('_') +
      '.png'
    const underlayPath = path.join(outputFolder, underlayFileName)
    const overlayRotatedImage = await combineImageList(
      [underlayPath, overlayPath],
      'overlay'
    )

    const outputFileName =
      [originalFileName, rotationDirection, state]
        .filter(x => x != null)
        .join('_') + '.png'

    const overlayOutputPath = path.join(outputFolder, outputFileName)
    await saveImage(overlayRotatedImage, overlayOutputPath)
  }

  for (const state of gravityStates) {
    if (isDirectional) {
      for (const rotationDirection of directions) {
        execute(state, rotationDirection)
      }
    } else {
      execute(state, null)
    }
  }
}

async function handleOverlayImage (
  outputFolder: string,
  originalFileName: string,
  isDirectional: boolean
) {
  const execute = async (
    movementDirection: RotationDirection,
    state: string,
    rotationDirection: RotationDirection | null
  ) => {
    const overlayFileName = [state, movementDirection].join('_') + '.png'
    const overlayPath = path.join(outputFolder, overlayFileName)
    const underlayFileName =
      [originalFileName, rotationDirection].filter(x => x != null).join('_') +
      '.png'
    const underlayPath = path.join(outputFolder, underlayFileName)
    // console.log(underlayPath, overlayPath)
    const overlayRotatedImage = await combineImages(underlayPath, overlayPath)

    const outputFileName =
      [originalFileName, rotationDirection, state, movementDirection]
        .filter(x => x != null)
        .join('_') + '.png'

    const overlayOutputPath = path.join(outputFolder, outputFileName)
    await saveImage(overlayRotatedImage, overlayOutputPath)
  }

  for (const movementDirection of directions) {
    for (const state of movementStates) {
      if (isDirectional) {
        for (const rotationDirection of directions) {
          execute(movementDirection, state, rotationDirection)
        }
      } else {
        execute(movementDirection, state, null)
      }
    }
  }
}
interface ImageInfo {
  x: number
  y: number
  w: number
  h: number
}

function getFileNameWithoutExtension (filePath: string): string {
  const fileNameWithExtension = path.basename(filePath)
  const fileNameWithoutExtension = path.parse(fileNameWithExtension).name
  return fileNameWithoutExtension
}

async function combineImagesInDirectory (
  directoryPath: string,
  outDirectoryPath: string
): Promise<void> {
  try {
    // Ensure the directory exists
    const stats = await fs.promises.stat(directoryPath)
    if (!stats.isDirectory()) {
      throw new Error('Provided path is not a directory')
    }

    // Read the contents of the directory
    const files = await fs.promises.readdir(directoryPath)

    // Filter out non-image files (you might want to adjust this based on your file types)
    const imageFiles = files
      .filter(file => /\.(png|jpg|jpeg|gif)$/i.test(path.extname(file)))
      .filter(file => !getFileNameWithoutExtension(file).startsWith('_'))

    // Determine the number of rows and columns for the grid
    const gridSize = Math.ceil(Math.sqrt(imageFiles.length))

    // Read the dimensions of one of the images to determine the size of the combined image
    // const sampleImage = await sharp(
    //   path.join(directoryPath, imageFiles[0])
    // ).metadata()

    const OFFSET = 1
    const LENGTH = 32 + OFFSET * 2

    // round width to next power of 2
    const combinedWidth = Math.pow(2, Math.ceil(Math.log2(LENGTH * gridSize)))
    const combinedHeight = combinedWidth

    // Initialize variables for the resulting image and tilemap

    const tilemap: { [key: string]: ImageInfo } = {}

    const compositeOptions: sharp.OverlayOptions[] = []
    // Combine images into a grid
    for (let index = 0; index < imageFiles.length; index++) {
      const file = imageFiles[index]
      const row = Math.floor(index / gridSize)
      const col = index % gridSize

      const imagePath = path.join(directoryPath, file)
      const imageBuffer = fs.readFileSync(imagePath)

      console.log(index, file, row, col)

      // Add the image to the combined image at the appropriate position
      compositeOptions.push({
        input: imageBuffer,
        left: col * LENGTH + OFFSET,
        top: row * LENGTH + OFFSET
      })

      const imageMeta = await sharp(imagePath).metadata()

      // Add information to the tilemap
      tilemap[file.slice(0, -4)] = {
        x: col * LENGTH + OFFSET,
        y: row * LENGTH + OFFSET,
        w: imageMeta.width!,
        h: imageMeta.height!
      }
    }

    const combinedImage = sharp({
      create: {
        width: combinedWidth,
        height: combinedHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    }).composite(compositeOptions)
    // Save the combined image
    await combinedImage.toFile(path.join(outDirectoryPath, 'combinedImage.png'))

    // Save the tilemap as JSON
    const tilemapPath = path.join(outDirectoryPath, 'tilemap.ts')

    const tilemapString = `
      export interface TileInfo {
        x: number
        y: number
        w: number
        h: number
      }

      export const tilemap: { [key: string]: TileInfo } = ${JSON.stringify(
        tilemap,
        null,
        2
      )};
    `
    await fs.promises.writeFile(tilemapPath, tilemapString)

    // console.log(
    //   `Images combined successfully. Resulting image and tilemap saved.`
    // )
  } catch (error) {
    console.error('Error combining images:', error)
  }
}

async function rotateImage (
  image: sharp.Sharp,
  direction: RotationDirection
): Promise<sharp.Sharp> {
  let degrees = 0

  switch (direction) {
    case RotationDirection.Right:
      degrees = 90
      break
    case RotationDirection.Down:
      degrees = 180
      break
    case RotationDirection.Left:
      degrees = 270
      break
    // For RotationDirection.Up, no rotation is needed
  }

  return image.clone().rotate(degrees)
}

async function saveImage (
  image: sharp.Sharp,
  outputPath: string
): Promise<void> {
  await image.toFile(outputPath)
}

// redstone dust

async function resizeImage (
  image: sharp.Sharp,
  width: number,
  height: number
): Promise<sharp.Sharp> {
  try {
    const resizedImage = await image.resize(width, height, {
      kernel: sharp.kernel.nearest
    })

    return resizedImage
  } catch (error) {
    console.error('Error resizing image:', error)
    throw error
  }
}

type PixelColor = {
  r: number
  g: number
  b: number
  a: number
}

type PixelCoord = {
  x: number
  y: number
}

type PixelModifierFunction = (
  pixel: PixelColor,
  coordinates: PixelCoord
) => PixelColor

async function modifyPixelsAndSave (
  inputPath: string,
  outputPath: string,
  pixelModifier: PixelModifierFunction
): Promise<void> {
  try {
    // Read the image from the input path
    const image = await sharp(inputPath)

    // Extract the image metadata
    const metadata: sharp.Metadata = await image.metadata()

    // Get pixel data as raw Buffer
    const rawPixelData = await image.raw().toBuffer({ resolveWithObject: true })
    const width = metadata.width!,
      height = metadata.height!
    // Iterate over each pixel and apply the pixel modifier function
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4
        const pixel = {
          r: rawPixelData.data[index],
          g: rawPixelData.data[index + 1],
          b: rawPixelData.data[index + 2],
          a: rawPixelData.data[index + 3]
        }

        const modifiedPixel = pixelModifier(pixel, { x, y })

        rawPixelData.data[index] = modifiedPixel.r
        rawPixelData.data[index + 1] = modifiedPixel.g
        rawPixelData.data[index + 2] = modifiedPixel.b
        rawPixelData.data[index + 3] = modifiedPixel.a
      }
    }

    // Create a new Sharp image with the modified pixel data
    const modifiedImage = sharp(rawPixelData.data, {
      raw: {
        width: width,
        height: height,
        channels: 4
      }
    })

    // Save the modified image to the output path
    await modifiedImage.toFile(outputPath)

    // console.log('Image modified and saved successfully.')
  } catch (error) {
    console.error('Error:', error)
  }
}

const processRedstoneDust = async () => {
  const directions = ['up', 'down', 'left', 'right']
  const imagePrefix = inputDirectory + '/redstone_dust'
  const outDir = outputDirectory
  // let isOn = false
  const buildImageName = (direction: string) => {
    return imagePrefix + '_' + direction + '.png'
  }

  for (let i = 0; i < 16; i++) {
    const inPath = path.join(
      inputDirectory,
      'redstone_dust_overlay_' + i + '.png'
    )
    const outPath = path.join(outputDirectory, 'number_' + i + '.png')
    // TODO: remove if no longer shifting and just copy
    await shiftImagePixels(inPath, outPath, 0, 0)
  }

  for (let i = 0; i < 16; i++) {
    // isOn = i > 0
    for (const isLeft of [false, true]) {
      for (const isRight of [false, true]) {
        for (const isUp of [false, true]) {
          for (const isDown of [false, true]) {
            let imageList = []
            let imageOutName = '/redstone_dust'
            if (isUp && isDown && !isLeft && !isRight) {
              imageList.push(buildImageName('ver'))
              imageOutName += '_up'
              imageOutName += '_down'
            } else if (!isUp && !isDown && isLeft && isRight) {
              imageList.push(buildImageName('hor'))
              imageOutName += '_left'
              imageOutName += '_right'
            } else {
              imageList.push(buildImageName('dot'))
              if (isUp) {
                imageList.push(buildImageName('up'))
                imageOutName += '_up'
              }
              if (isDown) {
                imageList.push(buildImageName('down'))
                imageOutName += '_down'
              }
              if (isLeft) {
                imageList.push(buildImageName('left'))
                imageOutName += '_left'
              }
              if (isRight) {
                imageList.push(buildImageName('right'))
                imageOutName += '_right'
              }
            }

            imageOutName += '_' + i + '.png'

            // console.log(imageList)
            const combinedImage: sharp.Sharp = await combineImageList(imageList)
            // const resizedImage = await resizeImageByMultiplier(combinedImage, 2)
            const outPath = path.join(outDir, imageOutName)
            await combinedImage.toFile(outPath)

            modifyPixelsAndSave(
              outPath,
              outPath,
              (pixel: PixelColor, coordinates: PixelCoord): PixelColor => {
                // console.log(
                //   coordinates,
                //   pixel,
                //   (pixel.r / 255) * (90 + (255 - 90) * (i / 15))
                // )
                if (i > 0) {
                  pixel.r = (pixel.r / 255) * (120 + (255 - 120) * (i / 15))
                } else {
                  pixel.r = 90
                }

                pixel.g = 0
                pixel.b = 0
                return pixel
              }
            )

            // await resizeImage2(outPath, outPath, 2)

            // const combinedImage2: sharp.Sharp = await combineImageList([
            //   outPath,
            //   path.join(outputDirectory, '_number_' + i + '.png')
            // ])
            // await combinedImage2.toFile(outPath)
          }
        }
      }
    }
  }
}

async function shiftImagePixels (
  inputPath: string,
  outputPath: string,
  offsetX: number,
  offsetY: number
): Promise<void> {
  try {
    // Read the input image
    const image = await Jimp.read(inputPath)

    // Get the original image dimensions
    const width = image.getWidth()
    const height = image.getHeight()

    // Create a new Jimp image to store the shifted pixel data
    const shiftedImage = new Jimp(width, height)

    // Iterate through each pixel and shift its position
    image.scan(0, 0, width, height, (x, y, idx) => {
      const targetX = (x + offsetX + width) % width
      const targetY = (y + offsetY + height) % height

      // Get the pixel color at the original position
      const color = image.getPixelColor(x, y)

      // Set the pixel color at the shifted position
      shiftedImage.setPixelColor(color, targetX, targetY)
    })

    // Save the shifted image to the specified output path
    await shiftedImage.writeAsync(outputPath)
  } catch (error) {
    console.error('Error shifting image pixels:', error)
  }
}

async function resizeImage2 (
  inputPath: string,
  outputPath: string,
  multiplier: number
): Promise<void> {
  try {
    // Read the input image
    const image = await Jimp.read(inputPath)

    // Get the original image dimensions
    const width = image.getWidth()
    const height = image.getHeight()

    // Calculate the new dimensions based on the multiplier
    const newWidth = Math.round(width * multiplier)
    const newHeight = Math.round(height * multiplier)

    // Create a new Jimp image with the new dimensions
    const resizedImage = new Jimp(newWidth, newHeight)

    // Perform nearest neighbor interpolation
    for (let x = 0; x < newWidth; x++) {
      for (let y = 0; y < newHeight; y++) {
        const originalX = Math.round(x / multiplier)
        const originalY = Math.round(y / multiplier)
        const color = image.getPixelColor(originalX, originalY)
        resizedImage.setPixelColor(color, x, y)
      }
    }

    // Save the resized image to the specified output path
    await resizedImage.writeAsync(outputPath)

    // console.log('Image resized successfully!')
  } catch (error) {
    console.error('Error resizing image:', error)
  }
}

function copyFile (sourcePath: string, destinationPath: string): void {
  const readStream = fs.createReadStream(sourcePath)
  const writeStream = fs.createWriteStream(destinationPath)

  readStream.pipe(writeStream)

  writeStream.on('finish', () => {
    console.log('File copied successfully.')
  })

  writeStream.on('error', err => {
    console.error('Error copying file:', err)
  })
}

// Example usage
const inputDirectory = 'src/images/base'
const outputDirectory = 'src/images/generated'

const main = async () => {
  console.log('processRedstoneDust')
  await processRedstoneDust()

  console.log('transfer gravity states')
  for (const x of gravityStates) {
    //TODO: this is async
    copyFile(
      path.join(inputDirectory, `${x}.png`),
      path.join(outputDirectory, `${x}.png`)
    )
  }

  console.log('processImagesInDirectory')
  await processImagesInDirectory(inputDirectory, outputDirectory)
  console.log('waiting for image files to be ready...')
  await sleep(3000)
  console.log('combineImagesInDirectory')
  await combineImagesInDirectory(outputDirectory, 'src/images')

  console.log('deletePngFiles')
  await deletePngFiles(outputDirectory)
}

main()
