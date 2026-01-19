const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    // Premium Design HTML
    const html = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Grok Status</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@300;400&display=swap');
            
            :root {
                --primary: #00ffcc;
                --bg: #050505;
                --glass: rgba(255, 255, 255, 0.05);
                --text: #ffffff;
            }
            
            body {
                margin: 0;
                padding: 0;
                background-color: var(--bg);
                color: var(--text);
                font-family: 'Roboto', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                overflow: hidden;
            }

            .container {
                background: var(--glass);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 255, 204, 0.2);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 0 50px rgba(0, 255, 204, 0.1);
                animation: float 6s ease-in-out infinite;
                max-width: 400px;
                width: 90%;
            }

            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
                100% { transform: translateY(0px); }
            }

            h1 {
                font-family: 'Orbitron', sans-serif;
                font-size: 3em;
                margin-bottom: 10px;
                color: var(--primary);
                text-shadow: 0 0 10px var(--primary);
                letter-spacing: 2px;
            }

            .status-indicator {
                display: inline-block;
                width: 15px;
                height: 15px;
                background-color: #00ff00;
                border-radius: 50%;
                margin-right: 10px;
                box-shadow: 0 0 10px #00ff00;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
                100% { opacity: 1; transform: scale(1); }
            }

            .status-text {
                font-size: 1.2em;
                margin-bottom: 30px;
            }

            .info {
                font-size: 0.9em;
                opacity: 0.7;
                margin-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 20px;
            }
            
            .loader {
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                border-top: 4px solid var(--primary);
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px auto;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="loader"></div>
            <h1>GROK</h1>
            <div class="status-container">
                <span class="status-indicator"></span>
                <span class="status-text">SYSTEM ONLINE</span>
            </div>
            <div class="info">
                Grok Discord Bot is running.<br>
                Free plan restrictions may apply.
            </div>
        </div>
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
