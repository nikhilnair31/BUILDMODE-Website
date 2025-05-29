// user.js

import { CONFIG } from './config.js';

// Redirect if not logged in
const token = localStorage.getItem('access_token');
if (!token) {
    window.location.href = '/login';
}

// Display username
document.getElementById('username').textContent = localStorage.getItem('username') || 'User';

// Bulk download handler
document.getElementById('bulk-download-button').addEventListener('click', () => {
    bulkDownloadAll();
});
async function bulkDownloadAll() {
    const accessToken = localStorage.getItem('access_token');
    // console.log("Access token:", accessToken);

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/bulk_download_all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'User-Agent': CONFIG.USER_AGENT,
                'X-App-Key': CONFIG.APP_KEY,
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'FORGOR_backup.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            const errorText = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorText}`);
        }
    } catch (error) {
        console.error('Error downloading ZIP:', error);
    }
}

// Logout handler
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    window.location.href = '/';
});