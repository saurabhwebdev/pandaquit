const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = [
  16, 32, 64, 144, 152, 167, 180, 192, 512
];

async function generateIcons() {
  const publicDir = path.join(__dirname, '..', 'public');
  const svgPath = path.join(publicDir, 'logo.svg');
  
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(svgPath);
    
    // Generate PNG files for each size
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(publicDir, `logo${size}.png`));
      
      console.log(`Generated ${size}x${size} icon`);
    }
    
    // Generate favicon.ico (includes multiple sizes)
    const faviconSizes = [16, 32, 64];
    const faviconBuffers = await Promise.all(
      faviconSizes.map(size =>
        sharp(svgBuffer)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );
    
    await sharp(faviconBuffers[0])
      .toFile(path.join(publicDir, 'favicon.ico'));
    
    console.log('Generated favicon.ico');
    
    // Generate og-image.png for social media
    await sharp(svgBuffer)
      .resize(1200, 630)
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));
    
    console.log('Generated og-image.png');
    
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons();
