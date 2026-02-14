// Script to create tray icon programmatically
// Run: node create-icons.js
const fs = require('fs');
const path = require('path');

// Minimal 16x16 PNG with a purple pixel pattern (Oh My OpenCode brand color)
// This creates a valid PNG file
function createMinimalPNG(size) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);  // width
  ihdrData.writeUInt32BE(size, 4);  // height
  ihdrData.writeUInt8(8, 8);        // bit depth
  ihdrData.writeUInt8(6, 9);        // color type (RGBA)
  ihdrData.writeUInt8(0, 10);       // compression
  ihdrData.writeUInt8(0, 11);       // filter
  ihdrData.writeUInt8(0, 12);       // interlace

  const ihdr = createChunk('IHDR', ihdrData);

  // IDAT chunk - create image data
  const rawData = Buffer.alloc((size * 4 + 1) * size); // +1 for filter byte per row

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 1;

  for (let y = 0; y < size; y++) {
    const rowOffset = y * (size * 4 + 1);
    rawData[rowOffset] = 0; // No filter

    for (let x = 0; x < size; x++) {
      const px = rowOffset + 1 + x * 4;
      const dx = x - centerX + 0.5;
      const dy = y - centerY + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= radius) {
        // Purple gradient: #6c5ce7 to #a29bfe
        const t = dist / radius;
        rawData[px] = Math.round(108 + t * (162 - 108));     // R
        rawData[px + 1] = Math.round(92 + t * (155 - 92));   // G
        rawData[px + 2] = Math.round(231 + t * (254 - 231)); // B
        rawData[px + 3] = 255;                                // A
      } else {
        rawData[px] = 0;
        rawData[px + 1] = 0;
        rawData[px + 2] = 0;
        rawData[px + 3] = 0;
      }
    }
  }

  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate icons
const assetsDir = __dirname;

// Tray icon (16x16)
fs.writeFileSync(path.join(assetsDir, 'tray-icon.png'), createMinimalPNG(16));
console.log('Created tray-icon.png (16x16)');

// App icon (256x256)
fs.writeFileSync(path.join(assetsDir, 'icon.png'), createMinimalPNG(256));
console.log('Created icon.png (256x256)');

console.log('Done! Icons created in', assetsDir);
