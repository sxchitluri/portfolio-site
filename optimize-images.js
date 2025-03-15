const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const QUALITY = 80; // Good balance between quality and file size
const MAX_WIDTH = 1200; // Maximum width for any image
const THUMBNAIL_WIDTH = 600; // Width for thumbnail versions

async function optimizeImage(inputPath, outputPath, options = {}) {
  const { width = MAX_WIDTH, quality = QUALITY, isThumb = false } = options;

  try {
    let pipeline = sharp(inputPath)
      .resize(width, null, {
        withoutEnlargement: true,
        fit: "inside",
      })
      .jpeg({ quality, mozjpeg: true });

    // Create WebP version
    await pipeline
      .clone()
      .webp({ quality })
      .toFile(outputPath.replace(/\.(jpg|png)$/, ".webp"));

    // Create JPEG version
    await pipeline.toFile(outputPath.replace(/\.(jpg|png)$/, ".jpg"));

    console.log(`✓ Optimized: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`✗ Error optimizing ${path.basename(inputPath)}:`, error);
  }
}

async function processImages() {
  const sourceDir = "./assets/media";
  const outputDir = "./assets/media/optimized";
  const thumbsDir = "./assets/media/optimized/thumbnails";

  // Create output directories if they don't exist
  await fs.mkdir(outputDir, { recursive: true });
  await fs.mkdir(thumbsDir, { recursive: true });

  // Get all images from source directory
  const files = await fs.readdir(sourceDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png)$/i.test(file));

  // Process each image
  for (const file of imageFiles) {
    const inputPath = path.join(sourceDir, file);
    const outputPath = path.join(outputDir, file);
    const thumbPath = path.join(thumbsDir, file);

    // Create optimized version
    await optimizeImage(inputPath, outputPath);

    // Create thumbnail version
    await optimizeImage(inputPath, thumbPath, {
      width: THUMBNAIL_WIDTH,
      quality: QUALITY,
      isThumb: true,
    });
  }
}

// Run the optimization
processImages().catch(console.error);
