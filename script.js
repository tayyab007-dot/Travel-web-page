document.addEventListener("DOMContentLoaded", function () {
    // Select the correct elements from the given HTML
    const searchInput = document.querySelector(".nav-search input"); 
    const searchButton = document.querySelector(".nav-search button[type='submit']");
    const clearButton = document.querySelector(".nav-search button[type='clear']");
    
    // Create a results container dynamically since it doesn't exist in HTML
    let resultsContainer = document.createElement("div");
    resultsContainer.className = "results";
    document.body.appendChild(resultsContainer);

    // Create a time display container
    const timeContainer = document.createElement("div");
    timeContainer.className = "date-time";
    document.body.prepend(timeContainer);

    async function fetchTime(query) {
        const apiKey = "GISSD0DULQZ6"; // Keep this secret in real projects!
        const timeApiUrl = `https://api.timezonedb.com/v2.1/get-time-zone?key=${apiKey}&format=json&by=zone&zone=${query}`;
        
        try {
            const response = await fetch(timeApiUrl);
            const data = await response.json();
            if (data.status === "OK") {
                timeContainer.textContent = `Current Time in ${query}: ${new Date(data.formatted).toLocaleString()}`;
            } else {
                timeContainer.textContent = "Time data unavailable";
            }
        } catch (error) {
            console.error("Error fetching time:", error);
            timeContainer.textContent = "Time data unavailable";
        }
    }

    function fetchDestinations(query) {
        const destinations = {
            beach: [
                { name: "Anse Source d'Argent", image: "beach1.jpeg", description: "One of the world's best beaches, located in Seychelles." },
                { name: "Navagio Beach", image: "beach2.jpeg", description: "A famous shipwreck cove in Zakynthos, Greece." }
            ],
            temple: [
                { name: "Angkor Wat", image: "temple1.jpeg", description: "A historic Hindu-Buddhist temple in Cambodia." },
                { name: "Borobudur", image: "temple2.jpeg", description: "A massive Buddhist temple complex in Indonesia." }
            ]
        };
        return destinations[query] || [];
    }

    async function displayResults() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;

        resultsContainer.innerHTML = "<h2>Recommended Destinations:</h2>";
        await fetchTime(query);
        const destinations = fetchDestinations(query);

        if (destinations.length === 0) {
            resultsContainer.innerHTML += "<p>No results found.</p>";
            return;
        }

        destinations.forEach(destination => {
            const destinationDiv = document.createElement("div");
            destinationDiv.className = "destination";
            destinationDiv.innerHTML = `
                <h3>${destination.name}</h3>
                <img src="${destination.image}" alt="${destination.name}">
                <p>${destination.description}</p>
            `;
            resultsContainer.appendChild(destinationDiv);
        });
    }

    // Add event listeners
    searchButton.addEventListener("click", displayResults);
    clearButton.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
        timeContainer.textContent = "";
    });
});