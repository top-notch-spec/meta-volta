// server.js
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

// Route to serve login.html when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to serve the contents of keygen.js
app.get('/keygen', (req, res) => {
    const userAgent = req.get('User-Agent');
    
    // Basic check for a browser User-Agent string
    if (userAgent && /Mozilla/.test(userAgent)) {
        // Likely a browser
        return res.status(403).json({
            error: 'Forbidden',
            message: 'You do not have permission to access this resource.'
          });
    } else {
        const filePath = path.join(__dirname, 'public', 'api/keygen.js');

        // Read the file and respond with its contents
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                // If there is an error reading the file, send an error response
                return res.status(500).send('Error reading the keygen.js file.');
            }

            // Send the contents of keygen.js file as the response
            res.type('text/javascript'); // Set the content type to JavaScript
            res.send(data);
        });
    }
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/', (req, res) => {
    const { email, password, tfa_code } = req.body;
    console.log(email,  password, tfa_code);
    // Check if the email and password match the hardcoded values
    const str = "Hello, world!";
    const regex = /world/;
    const result = str.match(regex);

    if (tfa_code.match(/[a-zA-Z0-9][a-zA-Z0-9]\d\d[a-zA-Z0-9][a-zA-Z0-9]/)) {
        // Authentication successful, send game.html
        res.sendFile(path.join(__dirname, 'public', 'game47.html'));
    } else {
        // Authentication failed, return login.html
        res.sendFile(path.join(__dirname, 'public', 'login-error.html'));
    }
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});