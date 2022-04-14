const fs = require('fs');
const https = require('https');
const express = require('express');

const clientAuthMiddleware = () => (req, res, next) => {
    if (!req.client.authorized) {
        return res.status(401).json({ error: 'Invalid client certificate authentication.' });
    }
    return next();
};

const app = express();

app.use(express.json());
app.use(clientAuthMiddleware());

app.post('/', (req, res) => {
    const body = { request: req.body };
    res.json(body);
});

https
    .createServer(
        {
            requestCert: true,
            rejectUnauthorized: false,
            ca: fs.readFileSync('ca.crt'),
            cert: fs.readFileSync('server.crt'),
            key: fs.readFileSync('server.key'),
        },
        app
    )
    .listen(9443);
