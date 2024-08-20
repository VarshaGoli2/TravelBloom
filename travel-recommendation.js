document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector('.search-action-button');
    const clearButton = document.getElementById('clear-button');
    const searchInput = document.querySelector('.search-input');
    const resultContainer = document.getElementById('search-results-container');

    const fetchData = async () => {
        try {
            const response = await fetch('travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return null;
        }
    };

    const displayResults = (places) => {
        resultContainer.innerHTML = '';
    
        if (places.length === 0) {
            resultContainer.innerHTML = '<p>No results found.</p>';
            return;
        }
    
        places.forEach(place => {
            const placeCard = document.createElement('div');
            placeCard.classList.add('place-card');
            placeCard.innerHTML = `
                <img src="${place.imageUrl}" alt="${place.name}">
                <h3>${place.name}</h3>
                <p>${place.description}</p>
                <button class="visit-button">Visit</button>
            `;
            resultContainer.appendChild(placeCard);
        });
    };

    const handleSearch = async () => {
        const keyword = searchInput.value.toLowerCase();
        const data = await fetchData();
        if (!data) return;

        let results = [];

        if (keyword.includes('beach')) {
            results = data.beaches;
        } else if (keyword.includes('temple')) {
            results = data.temples;
        } else {
            results = data.countries.flatMap(country => 
                country.cities.filter(city => city.name.toLowerCase().includes(keyword))
            );
        }

        displayResults(results);
    };

    const clearSearch = () => {
        searchInput.value = '';
        resultContainer.innerHTML = '';
    };

    searchButton.addEventListener('click', handleSearch);
    clearButton.addEventListener('click', clearSearch);
});