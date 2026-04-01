// Simple test to verify upload endpoint
import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

// Create a simple test file
const testBuffer = Buffer.from('test image content');
const formData = new FormData();
formData.append('images', testBuffer, {
  filename: 'test.jpg',
  contentType: 'image/jpeg'
});

console.log('Testing upload endpoint...');

fetch('http://localhost:3001/api/upload-test', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Upload successful:', data);
})
.catch(error => {
  console.error('Upload failed:', error);
});
