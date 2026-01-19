const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grok Status</title>
        <style>
            body {
                font-family: sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
                color: #333;
            }
            h1 {
                margin-bottom: 10px;
            }
            .status {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 1.2rem;
            }
            .dot {
                width: 12px;
                height: 12px;
                background-color: #4CAF50;
                border-radius: 50%;
            }
        </style>
    </head>
    <body>
        <h1>Grok Bot</h1>
        <div class="status">
            <span class="dot"></span>
            <span>System Online</span>
        </div>
        <p style="margin-top: 20px; color: #666;">Serving requests...</p>
    </body>
    </html>
    `;
    res.send(html);
});


function startServer() {
    app.listen(PORT, () => {
        console.log(`Web server running on port ${PORT}`);
    });
}

module.exports = { startServer };
