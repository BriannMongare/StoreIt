#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const weightMap = {
  '100': 'Thin',
  '200': 'ExtraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Black',
};

async function main() {
  const srcDir = path.join(process.cwd(), 'node_modules', '@fontsource', 'poppins', 'files');
  const destDir = path.join(process.cwd(), 'app', 'fonts');

  try {
    await fs.access(srcDir);
  } catch (err) {
    console.error('Could not find @fontsource/poppins files. Install it with:');
    console.error('  npm install @fontsource/poppins');
    process.exit(1);
  }

  await fs.mkdir(destDir, { recursive: true });

  const entries = await fs.readdir(srcDir);
  const woff2Files = entries.filter((f) => f.toLowerCase().endsWith('.woff2'));
  if (woff2Files.length === 0) {
    console.error('No .woff2 files found in', srcDir);
    process.exit(1);
  }

  for (const file of woff2Files) {
    const lower = file.toLowerCase();
    const weightMatch = lower.match(/(\d{3})/);
    const isItalic = /italic/.test(lower);
    let destName;
    if (isItalic) {
      destName = 'Poppins-Italic.woff2';
    } else if (weightMatch) {
      const weight = weightMatch[1];
      const namePart = weightMap[weight] || weight;
      destName = `Poppins-${namePart}.woff2`;
    } else {
      // fallback: copy with original name
      destName = file;
    }

    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, destName);
    await fs.copyFile(srcPath, destPath);
    console.log(`Copied ${file} -> ${path.relative(process.cwd(), destPath)}`);
  }

  console.log('Done copying Poppins font files to app/fonts. Restart the dev server.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
