// Flight data
const flights = {
    "AA1234": {
        number: "AA1234",
        speed: "845 km/h",
        altitude: "10,700 m",
        aircraft: "Boeing 787-9",
        origin: "JFK",
        destination: "LHR",
        originAirport: "John F. Kennedy International Airport",
        originCity: "New York",
        originCountry: "United States",
        originTerminal: "7",
        originTime: "18:30 EST",
        destinationAirport: "Heathrow Airport",
        destinationCity: "London",
        destinationCountry: "United Kingdom",
        destinationTerminal: "5",
        destinationTime: "06:45 GMT"
    },
    "DL5678": {
        number: "DL5678",
        speed: "910 km/h",
        altitude: "11,300 m",
        aircraft: "Airbus A330-900neo",
        origin: "ATL",
        destination: "CDG",
        originAirport: "Hartsfield-Jackson Atlanta International Airport",
        originCity: "Atlanta",
        originCountry: "United States",
        originTerminal: "I",
        originTime: "20:15 EST",
        destinationAirport: "Charles de Gaulle Airport",
        destinationCity: "Paris",
        destinationCountry: "France",
        destinationTerminal: "2E",
        destinationTime: "10:30 CET"
    },
    "UA9012": {
        number: "UA9012",
        speed: "780 km/h",
        altitude: "9,800 m",
        aircraft: "Boeing 777-200ER",
        origin: "SFO",
        destination: "NRT",
        originAirport: "San Francisco International Airport",
        originCity: "San Francisco",
        originCountry: "United States",
        originTerminal: "International",
        originTime: "12:45 PST",
        destinationAirport: "Narita International Airport",
        destinationCity: "Tokyo",
        destinationCountry: "Japan",
        destinationTerminal: "1",
        destinationTime: "16:20 JST"
    },
    "LH3456": {
        number: "LH3456",
        speed: "820 km/h",
        altitude: "10,200 m",
        aircraft: "Airbus A350-900",
        origin: "FRA",
        destination: "DXB",
        originAirport: "Frankfurt Airport",
        originCity: "Frankfurt",
        originCountry: "Germany",
        originTerminal: "1",
        originTime: "14:20 CET",
        destinationAirport: "Dubai International Airport",
        destinationCity: "Dubai",
        destinationCountry: "UAE",
        destinationTerminal: "3",
        destinationTime: "22:45 GST"
    },
    "BA7890": {
        number: "BA7890",
        speed: "870 km/h",
        altitude: "11,000 m",
        aircraft: "Airbus A380",
        origin: "LHR",
        destination: "SIN",
        originAirport: "Heathrow Airport",
        originCity: "London",
        originCountry: "United Kingdom",
        originTerminal: "5",
        originTime: "21:10 GMT",
        destinationAirport: "Changi Airport",
        destinationCity: "Singapore",
        destinationCountry: "Singapore",
        destinationTerminal: "3",
        destinationTime: "17:30 SGT"
    }
};

// Select flight elements
const flightElements = document.querySelectorAll('.flight');
const noSelection = document.getElementById('no-selection');
const flightDetails = document.getElementById('flight-details');
const airportDetails = document.getElementById('airport-details');

// Add click event to each flight
flightElements.forEach(flight => {
    flight.addEventListener('click', () => {
        const flightNumber = flight.getAttribute('data-flight');
        const flightData = flights[flightNumber];
        
        if (flightData) {
            // Update flight details
            document.getElementById('flight-number').textContent = flightData.number;
            document.getElementById('flight-speed').textContent = flightData.speed;
            document.getElementById('flight-altitude').textContent = flightData.altitude;
            document.getElementById('flight-aircraft').textContent = flightData.aircraft;
            document.getElementById('flight-origin').textContent = flightData.origin;
            document.getElementById('flight-destination').textContent = flightData.destination;
            
            // Update airport details
            document.getElementById('origin-airport').textContent = flightData.originAirport;
            document.getElementById('origin-city').textContent = flightData.originCity;
            document.getElementById('origin-country').textContent = flightData.originCountry;
            document.getElementById('origin-terminal').textContent = flightData.originTerminal;
            document.getElementById('origin-time').textContent = flightData.originTime;
            
            document.getElementById('destination-airport').textContent = flightData.destinationAirport;
            document.getElementById('destination-city').textContent = flightData.destinationCity;
            document.getElementById('destination-country').textContent = flightData.destinationCountry;
            document.getElementById('destination-terminal').textContent = flightData.destinationTerminal;
            document.getElementById('destination-time').textContent = flightData.destinationTime;
            
            // Show details, hide no selection message
            noSelection.style.display = 'none';
            flightDetails.style.display = 'block';
            airportDetails.style.display = 'block';
            
            // Highlight selected flight
            flightElements.forEach(f => f.style.opacity = '0.6');
            flight.style.opacity = '1';
            flight.style.zIndex = '100';
        }
    });
});

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
    flightElements.forEach(f => f.style.opacity = '1');
    noSelection.style.display = 'flex';
    flightDetails.style.display = 'none';
    airportDetails.style.display = 'none';
});

// Animate flights
function animateFlights() {
    flightElements.forEach(flight => {
        const top = parseInt(flight.style.top);
        const left = parseInt(flight.style.left);
        
        // Randomly adjust position
        flight.style.top = `${top + (Math.random() * 0.6 - 0.3)}%`;
        flight.style.left = `${left + (Math.random() * 0.6 - 0.3)}%`;
    });
    
    requestAnimationFrame(animateFlights);
}

animateFlights();