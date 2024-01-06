const fetchPngFilenames = (): string[] => {
  const context = require.context('../images/', false, /\.png$/)
  return context.keys().map(filename => filename.replace('./', ''))
}

const loadImage = async (path: string): Promise<HTMLImageElement> => {
  return new Promise(resolve => {
    const img = new Image()
    img.src = path
    img.onload = () => {
      resolve(img)
    }
  })
}

export const loadImages = async () => {
  const images: Map<string, HTMLImageElement> = new Map()

  const imagePaths = fetchPngFilenames()
  console.log(imagePaths)
  const loadImagePromises = imagePaths.map(async path => {
    const img = await loadImage('./src/images/' + path)
    images.set(path.replace('.png', ''), img)
  })

  await Promise.all(loadImagePromises)
  return images
}
