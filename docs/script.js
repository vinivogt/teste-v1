// Simple animation for flights
document.querySelectorAll('.flight').forEach(flight => {
    flight.style.animationDelay = `${Math.random() * 2}s`;
});

// Add more flights dynamically
setInterval(() => {
    const radar = document.querySelector('.radar-preview');
    const flight = document.createElement('div');
    flight.className = 'flight';
    flight.style.top = `${Math.random() * 80 + 10}%`;
    flight.style.left = `${Math.random() * 80 + 10}%`;
    radar.appendChild(flight);
    // Remove some flights after a while
    if (radar.children.length > 8) {
        radar.removeChild(radar.children[1]);
    }
}, 2000);
