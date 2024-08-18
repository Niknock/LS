const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API-Endpunkt zum Speichern von Kunden in kunden.json
app.post('/save-customers', (req, res) => {
    const customers = req.body;
    fs.writeFile(path.join(__dirname, 'public', 'kunden.json'), JSON.stringify(customers, null, 2), (err) => {
        if (err) {
            res.status(500).send('Fehler beim Speichern der Kunden.');
        } else {
            res.send('Kunden erfolgreich gespeichert.');
        }
    });
});

// API-Endpunkt zum Speichern von Feldern in felder.json
app.post('/save-fields', (req, res) => {
    const fields = req.body;
    fs.writeFile(path.join(__dirname, 'public', 'felder.json'), JSON.stringify(fields, null, 2), (err) => {
        if (err) {
            res.status(500).send('Fehler beim Speichern der Felder.');
        } else {
            res.send('Felder erfolgreich gespeichert.');
        }
    });
});

// Server starten
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
