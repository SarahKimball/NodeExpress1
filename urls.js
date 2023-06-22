const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');

// Function to download a URL and save its HTML to a file
function downloadURL(url) {
  const protocol = url.startsWith('https') ? https : http;
  const file = new URL(url).hostname;

  protocol.get(url, (res) => {
    let html = '';

    res.on('data', (chunk) => {
      html += chunk;
    });

    res.on('end', () => {
      fs.writeFile(`${file}.txt`, html, (err) => {
        if (err) {
          console.error(`Couldn't write to ${file}.txt: ${err.message}`);
        } else {
          console.log(`Wrote to ${file}.txt`);
        }
      });
    });
  }).on('error', (err) => {
    console.error(`Couldn't download ${url}: ${err.message}`);
  });
}

// Read the filename from command line arguments
const filename = process.argv[2];

if (!filename) {
  console.error('Please provide a filename as an argument');
  process.exit(1);
}

// Read the URLs from the file
fs.readFile(filename, 'utf-8', (err, data) => {
  if (err) {
    console.error(`Couldn't read ${filename}: ${err.message}`);
    process.exit(1);
  }

  const urls = data.split('\n').filter((url) => url.trim() !== '');

  // Download each URL
  urls.forEach((url) => {
    downloadURL(url);
  });
});
