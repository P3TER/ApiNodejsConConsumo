const express = require('express');
const path = require('path');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 8080;

// Servir los archivos estáticos
app.use(express.static(path.join(__dirname, './')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.use(cors({ origin: `http://localhost:8080` }));

// Resto de la configuración de tu servidor...

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
