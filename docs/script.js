// Flight data storage
let flights = {};
let demoMode = false;
let demoInterval;

// DOM elements
const flightElementsContainer = document.getElementById('map-overlay');
const noSelection = document.getElementById('no-selection');
const flightDetails = document.getElementById('flight-details');
const airportDetails = document.getElementById('airport-details');
const lastUpdatedElement = document.getElementById('last-updated');

// API endpoints
const OPENSKY_API_BASE = 'https://opensky-network.org/api';
const AEROAPI_BASE = 'https://aeroapi.flightaware.com/aeroapi';

// Fetch real flight data from OpenSky Network API
async function fetchFlightData() {
    const latitude = parseFloat(document.getElementById('latitude').value);
    const longitude = parseFloat(document.getElementById('longitude').value);
    const radius = parseInt(document.getElementById('radius').value);
    
    // Convert radius from km to degrees (approximate)
    const degreeRadius = radius / 111;
    
    // Calculate bounding box
    const lamin = latitude - degreeRadius;
    const lomin = longitude - degreeRadius;
    const lamax = latitude + degreeRadius;
    const lomax = longitude + degreeRadius;
    
    try {
        const response = await fetch(`${OPENSKY_API_BASE}/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`);
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.states) {
            processFlightData(data.states);
            updateLastUpdated();
        } else {
            throw new Error('No flight data available');
        }
    } catch (error) {
        console.error('Error fetching flight data:', error);
        alert('Failed to fetch flight data. Using demo mode instead.');
        startDemoMode();
    }
}

// Process the flight data from API
function processFlightData(flightStates) {
    // Clear existing flights
    flightElementsContainer.innerHTML = '';
    flights = {};
    
    // Process each flight
    flightStates.forEach(state => {
        const [icao24, callsign, originCountry, timePosition, lastContact, 
               longitude, latitude, altitude, onGround, velocity, heading, 
               verticalRate, sensors, altitudeType] = state;
        
        // Only show flights with position data
        if (latitude && longitude && altitude > 0) {
            const flightId = icao24;
            
            // Convert coordinates to percentage for display
            const latPercent = ((latitude - parseFloat(document.getElementById('latitude').value) + 5) / 10) * 100;
            const lonPercent = ((longitude - parseFloat(document.getElementById('longitude').value) + 5) / 10) * 100;
            
            // Create flight element
            const flightElement = document.createElement('div');
            flightElement.className = 'flight';
            flightElement.style.top = `${latPercent}%`;
            flightElement.style.left = `${lonPercent}%`;
            flightElement.setAttribute('data-flight', flightId);
            
            // Add click event
            flightElement.addEventListener('click', () => showFlightDetails(flightId));
            
            // Add to container
            flightElementsContainer.appendChild(flightElement);
            
            // Store flight data
            flights[flightId] = {
                number: callsign && callsign.trim() ? callsign.trim() : 'N/A',
                speed: velocity ? `${Math.round(velocity * 3.6)} km/h` : 'N/A',
                altitude: altitude ? `${Math.round(altitude)} m` : 'N/A',
                aircraft: icao24,
                origin: originCountry || 'N/A',
                destination: 'N/A',
                originCountry: originCountry || 'N/A',
                heading: heading ? `${Math.round(heading)}°` : 'N/A',
                verticalRate: verticalRate ? `${Math.round(verticalRate)} m/s` : 'N/A'
            };
        }
    });
    
    // If no flights found, show message
    if (flightElementsContainer.children.length === 0) {
        flightElementsContainer.innerHTML = '<div class="no-selection"><p><i class="fas fa-plane-slash fa-2x"></i><br><br>No flights found in this area</p></div>';
    }
}

// Show flight details when a flight is clicked
function showFlightDetails(flightId) {
    const flightData = flights[flightId];
    
    if (flightData) {
        // Update flight details
        document.getElementById('flight-number').textContent = flightData.number;
        document.getElementById('flight-speed').textContent = flightData.speed;
        document.getElementById('flight-altitude').textContent = flightData.altitude;
        document.getElementById('flight-aircraft').textContent = flightData.aircraft;
        document.getElementById('flight-origin').textContent = flightData.origin;
        document.getElementById('flight-destination').textContent = flightData.destination;
        document.getElementById('flight-heading').textContent = flightData.heading;
        document.getElementById('flight-vertical').textContent = flightData.verticalRate;
        
        // Update airport details (simplified for demo)
        document.getElementById('origin-airport').textContent = `${flightData.origin} Airport`;
        document.getElementById('origin-city').textContent = 'Unknown';
        document.getElementById('origin-country').textContent = flightData.originCountry;
        document.getElementById('origin-time').textContent = '--:--';
        
        document.getElementById('destination-airport').textContent = 'Unknown Airport';
        document.getElementById('destination-city').textContent = 'Unknown';
        document.getElementById('destination-country').textContent = 'Unknown';
        document.getElementById('destination-time').textContent = '--:--';
        
        // Show details, hide no selection message
        noSelection.style.display = 'none';
        flightDetails.style.display = 'block';
        airportDetails.style.display = 'block';
        
        // Highlight selected flight
        document.querySelectorAll('.flight').forEach(f => f.style.opacity = '0.6');
        document.querySelector(`.flight[data-flight="${flightId}"]`).style.opacity = '1';
    }
}

// Update last updated timestamp
function updateLastUpdated() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    lastUpdatedElement.textContent = `Last updated: ${timeString}`;
}

// Demo mode with simulated flight data
function startDemoMode() {
    demoMode = true;
    document.getElementById('demo-mode').textContent = 'Stop Demo';
    document.getElementById('demo-mode').innerHTML = '<i class="fas fa-stop"></i> Stop Demo';
    
    // Clear existing flights
    flightElementsContainer.innerHTML = '';
    flights = {};
    
    // Create demo flights
    for (let i = 0; i < 8; i++) {
        const flightId = `DEMO${i}`;
        const latPercent = 20 + Math.random() * 60;
        const lonPercent = 20 + Math.random() * 60;
        
        // Create flight element
        const flightElement = document.createElement('div');
        flightElement.className = 'flight';
        flightElement.style.top = `${latPercent}%`;
        flightElement.style.left = `${lonPercent}%`;
        flightElement.setAttribute('data-flight', flightId);
        
        // Add click event
        flightElement.addEventListener('click', () => showFlightDetails(flightId));
        
        // Add to container
        flightElementsContainer.appendChild(flightElement);
        
        // Store flight data
        flights[flightId] = {
            number: `DEMO${i}`,
            speed: `${Math.round(600 + Math.random() * 400)} km/h`,
            altitude: `${Math.round(5000 + Math.random() * 8000)} m`,
            aircraft: `B${Math.round(737 + Math.random() * 100)}`,
            origin: i % 2 === 0 ? 'JFK' : 'LAX',
            destination: i % 2 === 0 ? 'LAX' : 'JFK',
            originCountry: 'United States',
            heading: `${Math.round(Math.random() * 360)}°`,
            verticalRate: `${Math.round(-10 + Math.random() * 20)} m/s`
        };
    }
    
    // Animate demo flights
    if (demoInterval) clearInterval(demoInterval);
    demoInterval = setInterval(moveDemoFlights, 2000);
}

// Stop demo mode
function stopDemoMode() {
    demoMode = false;
    document.getElementById('demo-mode').textContent = 'Demo Mode';
    document.getElementById('demo-mode').innerHTML = '<i class="fas fa-play"></i> Demo Mode';
    
    if (demoInterval) {
        clearInterval(demoInterval);
        demoInterval = null;
    }
}

// Move demo flights around
function moveDemoFlights() {
    if (!demoMode) return;
    
    document.querySelectorAll('.flight').forEach(flight => {
        const flightId = flight.getAttribute('data-flight');
        const currentTop = parseFloat(flight.style.top);
        const currentLeft = parseFloat(flight.style.left);
        
        // Move flight slightly
        const newTop = Math.max(10, Math.min(90, currentTop + (Math.random() * 10 - 5)));
        const newLeft = Math.max(10, Math.min(90, currentLeft + (Math.random() * 10 - 5)));
        
        flight.style.top = `${newTop}%`;
        flight.style.left = `${newLeft}%`;
        
        // Update flight data slightly
        if (flights[flightId]) {
            const currentSpeed = parseInt(flights[flightId].speed);
            const currentAlt = parseInt(flights[flightId].altitude);
            
            flights[flightId].speed = `${Math.max(300, currentSpeed + (Math.random() * 40 - 20))} km/h`;
            flights[flightId].altitude = `${Math.max(1000, currentAlt + (Math.random() * 200 - 100))} m`;
            flights[flightId].heading = `${Math.round(Math.random() * 360)}°`;
            flights[flightId].verticalRate = `${Math.round(-10 + Math.random() * 20)} m/s`;
        }
    });
    
    updateLastUpdated();
}

// Add zoom functionality
const globe = document.querySelector('.globe');
const clouds = document.querySelector('.clouds');
let scale = 1;

document.getElementById('zoom-in').addEventListener('click', () => {
    if (scale < 1.8) {
        scale += 0.2;
        globe.style.transform = `rotate(${scale * 20}deg) scale(${scale})`;
        clouds.style.transform = `rotate(${scale * 20}deg) scale(${scale})`;
    }
});

document.getElementById('zoom-out').addEventListener('click', () => {
    if (scale > 0.6) {
        scale -= 0.2;
        globe.style.transform = `rotate(${scale * 20}deg) scale(${scale})`;
        clouds.style.transform = `rotate(${scale * 20}deg) scale(${scale})`;
    }
});

document.getElementById('reset-view').addEventListener('click', () => {
    scale = 1;
    globe.style.transform = 'rotate(0deg) scale(1)';
    clouds.style.transform = 'rotate(0deg) scale(1)';
    document.querySelectorAll('.flight').forEach(f => f.style.opacity = '1');
    noSelection.style.display = 'flex';
    flightDetails.style.display = 'none';
    airportDetails.style.display = 'none';
});

// Set up event listeners
document.getElementById('fetch-data').addEventListener('click', () => {
    if (demoMode) stopDemoMode();
    document.getElementById('fetch-data').disabled = true;
    document.getElementById('fetch-data').innerHTML = '<span class="loading"></span> Loading...';
    
    fetchFlightData().finally(() => {
        document.getElementById('fetch-data').disabled = false;
        document.getElementById('fetch-data').innerHTML = '<i class="fas fa-sync-alt"></i> Fetch Live Data';
    });
});

document.getElementById('demo-mode').addEventListener('click', () => {
    if (demoMode) {
        stopDemoMode();
        flightElementsContainer.innerHTML = '';
        noSelection.style.display = 'flex';
        flightDetails.style.display = 'none';
        airportDetails.style.display = 'none';
    } else {
        startDemoMode();
        noSelection.style.display = 'none';
    }
});

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    // Start with demo mode
    startDemoMode();
});