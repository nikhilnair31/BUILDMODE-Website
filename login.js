// login.js

import { CONFIG } from './config.js';

// === Form Tab Switching ===
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Show corresponding form
        const target = tab.getAttribute('data-target');
        document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
        document.getElementById(target).classList.add('active');
    });
});

// === Login ===
document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    loginUser(username, password).then(response => {
        if (response.status === 'success') {
            console.log("Logged in successfully!");

            localStorage.setItem('username', username);
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('refresh_token', response.data.refresh_token);
            window.location.href = '/app';
        } 
        else {
            console.log(response.message);
        }
    });
});
async function loginUser(username, password) {
    try {
        console.log(`Logging in with username: ${username} and password: ${password}`);
        
        console.log(`API_BASE: ${CONFIG.API_BASE} USER_AGENT: ${CONFIG.USER_AGENT} APP_KEY: ${CONFIG.APP_KEY}`);
        const res = await fetch(`${CONFIG.API_BASE}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': CONFIG.USER_AGENT,
                'X-App-Key': CONFIG.APP_KEY,
            },
            body: JSON.stringify({ username, password }),
        });
        console.log(`Response status: ${res.status}`);

        if (res.status === 200) {
            const data = await res.json();
            return { status: 'success', data: data };
        } 
        else {
            return { status: 'error', message: data.message };
        }
    } 
    catch (err) {
        return { status: 'error', message: 'Network error' };
    }
}

// === Register ===
document.getElementById('register-button').addEventListener('click', () => {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    console.log(`Registering with username: ${username} and password: ${password}`);

    registerUser(username, password).then(response => {
        console.log(`Register response: ${JSON.stringify(response)}`);
        if (response.status === 'success') {
            console.log("Registered successfully!");
            
            loginUser(username, password).then(response => {
                if (response.status === 'success') {
                    console.log("Logged in successfully!");
                    window.close();
                } 
                else {
                    console.log(response.message);
                }
            });
        } 
        else {
            console.log(response.message);
        }
    });
});
async function registerUser(username, password) {
    try {
        const res = await fetch(`${CONFIG.API_BASE}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': CONFIG.USER_AGENT,
                'X-App-Key': CONFIG.APP_KEY,
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (res.ok) {
            await chrome.storage.local.set({
                username: username,
            });
            return { status: 'success' };
        } 
        else {
            return { status: 'error', message: data.message };
        }
    } 
    catch (err) {
        return { status: 'error', message: 'Network error' };
    }
}