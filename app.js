// app.js

import { CONFIG } from './config.js';

// Redirect to login if not authenticated
const token = localStorage.getItem('access_token');
if (!token) {
    window.location.href = 'login.html';
}

document.getElementById('user-button').addEventListener('click', () => {
    window.location.href = '/user';
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-bar');
    searchInput.addEventListener('input', (event) => {
        const query = event.target.value;
        console.log("Search query:", query);
        searchToServer(query);
    });
});
async function searchToServer(content) {
    const accessToken = localStorage.getItem('access_token');
    // console.log("Access token:", accessToken);

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': CONFIG.USER_AGENT,
                'X-App-Key': CONFIG.APP_KEY,
            },
            body: JSON.stringify({searchText: content}),
        });

        if (response.status === 200) {
            const responseJson = await response.json();
            // console.log("API response:", responseJson);

            chrome?.storage?.local?.set?.({ responseContent: responseJson, queryText: content });

            showResults(responseJson.results);
        } 
        else {
            const errorText = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorText}`);
        }
    }
    catch (error) {
        console.error('Error sending data to API:', error);
    }
}
function showResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // clear old results

    if (!results || results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach(async (result) => {
        // console.log("Result:", result);

        const card = document.createElement('div');
        card.className = 'result-card';

        const img = document.createElement('img');
        img.alt = 'Saved post image';
        img.style.width = '200px';

        try {
            const accessToken = localStorage.getItem('access_token');
            const headers = {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': CONFIG.USER_AGENT,
                'X-App-Key': CONFIG.APP_KEY,
            }
            // console.log("Image fetch headers:", headers);
            const imgResponse = await fetch(`${CONFIG.API_BASE}/api/get_image/${result.image_path}`, {
                headers: headers
            });
            console.log("Image fetch response:", imgResponse);

            if (!imgResponse.ok) {
                throw new Error(`Image fetch failed: ${imgResponse.status}`);
            }

            const blob = await imgResponse.blob();
            img.src = URL.createObjectURL(blob);
        } catch (err) {
            console.error("Image fetch error:", err);
            img.alt = 'Failed to load image';
        }

        const tags = document.createElement('pre');
        tags.textContent = result.image_text.trim();

        const time = document.createElement('p');
        time.textContent = `Saved on: ${new Date(result.timestamp_str * 1000).toLocaleString()}`;

        card.appendChild(img);
        card.appendChild(tags);
        card.appendChild(time);

        resultsDiv.appendChild(card);
    });
}
