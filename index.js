const express= require("express");

const fs = require('fs');
const path = require('path');

// Path to index.js file
const filePath = path.join(__dirname, 'index.html');

// Read and log the contents of index.js
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }
  console.log('Contents of index.js:');
  console.log(data);
});