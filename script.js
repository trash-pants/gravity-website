let rotation = 0;
const sky = document.getElementById('rotating-sky');
const rotationSpeed = 0.02; // Adjust this value to control rotation speed

function rotateSky() {
    rotation += rotationSpeed;
    sky.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(rotateSky);
}

// Start the rotation when the image is fully loaded
sky.addEventListener('load', () => {
    rotateSky();
}); 