const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors');
const userRoutes = require('./routes/users');
const listRoutes = require('./routes/list');
const clientPath = path.join(__dirname, '..', 'client');
const port = 3000

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoutes);
app.use('/api/list', listRoutes);

// משרת קבצים סטטיים מהתיקייה client
app.use(express.static(clientPath));
// שולח את index.html כברירת מחדל כאשר נכנסים ל-root
app.get('/', (req, res) => {
    res.sendFile(path.join(clientPath, 'pages', 'index.html'));
});

app.get('/nav.html', (req, res) => {
    res.sendFile(path.join(clientPath, 'nav', 'nav.html'));
});

app.get('/nav.css', (req, res) => {
    res.sendFile(path.join(clientPath, 'nav', 'nav.css'));
});
app.get('/:page', (req, res) => {
    const page = req.params.page + '.html';
    const filePath = path.join(clientPath, 'pages', page);
    const file404Path = path.join(clientPath, 'pages', '404.html');

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).sendFile(file404Path);
        }
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


