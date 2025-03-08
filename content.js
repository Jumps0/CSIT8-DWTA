// Create a div element
const square = document.createElement('div');

// Set the style for the div
square.style.position = 'fixed';
square.style.top = '0';
square.style.right = '0';
square.style.width = '500px';
square.style.height = '300px';
square.style.backgroundColor = 'white';
square.style.color = 'black';
square.style.textAlign = 'center';
square.style.lineHeight = '300px';
square.style.fontSize = '24px';
square.style.zIndex = '1000';
square.style.border = '1px solid black';

// Set the text content
square.textContent = 'test';

// Append the div to the body
document.body.appendChild(square);