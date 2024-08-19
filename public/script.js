// Funktion zum Laden der Daten aus localStorage
function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Funktion zum Speichern der Daten in localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Kunden laden und anzeigen
function loadCustomers() {
    fetch('kunden.json')
        .then(response => response.json())
        .then(customers => {
            saveData('customers', customers);  // Optional: In localStorage speichern
            displayCustomers(customers);
        })
        .catch(error => console.error('Fehler beim Laden der Kunden:', error));
}

// Felder laden und anzeigen
function loadFields() {
    fetch('felder.json')
        .then(response => response.json())
        .then(fields => {
            saveData('fields', fields);  // Optional: In localStorage speichern
            displayFields(fields);
        })
        .catch(error => console.error('Fehler beim Laden der Felder:', error));
}
// Beispielhafte Funktion zum Speichern von Daten in localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function saveCustomersToServer(customers) {
    fetch('/save-customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customers)
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        alert(message);
    })
    .catch(error => console.error('Fehler beim Speichern der Kunden:', error));
}

function createCustomer() {
    const customerName = document.getElementById('customerName').value;
    const discount = document.getElementById('discount').value;

    if (customerName && discount) {
        let customers = loadData('customers');
        customers.push({ name: customerName, discount: discount });
        saveData('customers', customers);
        displayCustomers(customers);
        saveCustomersToServer(customers);  // Kunden auf dem Server speichern
    } else {
        alert('Bitte füllen Sie alle Felder aus.');
    }
}

function saveFieldsToServer(fields) {
    fetch('/save-fields', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields)
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        alert(message);
    })
    .catch(error => console.error('Fehler beim Speichern der Felder:', error));
}

function createField() {
    const fieldName = document.getElementById('fieldName').value;
    const fieldSize = document.getElementById('fieldSize').value;

    if (fieldName && fieldSize) {
        let fields = loadData('fields');
        fields.push({ name: fieldName, size: fieldSize });
        saveData('fields', fields);
        displayFields(fields);
        saveFieldsToServer(fields);  // Felder auf dem Server speichern
    } else {
        alert('Bitte füllen Sie alle Felder aus.');
    }
}

// Funktion zum Speichern der Daten in einer JSON-Datei
function saveToJsonFile(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Daten aus localStorage laden
function loadData(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

// Funktionen zum Anzeigen der Kunden und Felder
function displayCustomers(customers) {
    const customerList = document.getElementById('customerList');
    const customerSelect = document.getElementById('customerSelect');

    if (customerList) {
        customerList.innerHTML = '';
        customers.forEach(customer => {
            let li = document.createElement('li');
            li.textContent = `${customer.name} - ${customer.discount}% Rabatt`;
            customerList.appendChild(li);
        });
    }

    // Fülle die Auswahlfelder auf der gesamten Website
    if (customerSelect) {
        customerSelect.innerHTML = customers.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    }
}

function displayFields(fields) {
    const fieldList = document.getElementById('fieldList');
    const fieldSelect = document.getElementById('fieldSelect');

    if (fieldList) {
        fieldList.innerHTML = '';
        fields.forEach(field => {
            let li = document.createElement('li');
            li.textContent = `${field.name} - ${field.size} Hektar`;
            fieldList.appendChild(li);
        });
    }

    // Fülle die Auswahlfelder auf der gesamten Website
    if (fieldSelect) {
        fieldSelect.innerHTML = fields.map(f => `<option value="${f.name}">${f.name}</option>`).join('');
    }
}

// Funktion zum Berechnen der Kosten
function calculateCosts() {
    const selectedCustomer = document.getElementById('customerSelect').value;
    const selectedField = document.getElementById('fieldSelect').value;
    const selectedCrop = document.getElementById('cropType');
    const cropPrice = selectedCrop.options[selectedCrop.selectedIndex].getAttribute('data-price');
    const useGrubber = document.getElementById('useGrubber').checked;
    const useFertilizer = document.getElementById('useFertilizer').checked;

    // Überprüfen, ob alle notwendigen Felder ausgewählt sind
    if (!selectedCustomer || !selectedField) {
        alert('Bitte wählen Sie einen Kunden und ein Feld aus.');
        return;
    }

    // Basispreis für die Fruchtart
    let totalCost = parseFloat(cropPrice);

    // Kosten hinzufügen, wenn grubbern ausgewählt ist
    if (useGrubber) {
        totalCost += 4500;
    }

    // Kosten hinzufügen, wenn düngen ausgewählt ist
    if (useFertilizer) {
        totalCost += 6000;
    }

    // Feldgröße holen
    const fields = loadData('fields');
    const field = fields.find(f => f.name === selectedField);
    if (field) {
        totalCost *= parseFloat(field.size);
        totalCost += parseFloat(field.size)*1000;
    } else {
        alert('Fehler: Feldgröße konnte nicht ermittelt werden.');
        return;
    }

    // Rabatt vom Kunden holen
    const customers = loadData('customers');
    const customer = customers.find(c => c.name === selectedCustomer);
    if (customer) {
        const discount = parseFloat(customer.discount);
        totalCost -= (totalCost * (discount / 100));
    } else {
        alert('Fehler: Rabatt konnte nicht ermittelt werden.');
        return;
    }

    // Ergebnis anzeigen
    document.getElementById('costResult').textContent = `Der Kostenvoranschlag beträgt: ${totalCost.toFixed(2)} €`;
}

// Funktion zum Berechnen der Kosten
function calculateCostsDreschen() {
    const selectedCustomer = document.getElementById('customerSelect').value;
    const selectedField = document.getElementById('fieldSelect').value;
    const selectedCrop = document.getElementById('cropType');
    const cropPrice = selectedCrop.options[selectedCrop.selectedIndex].getAttribute('data-price');

    // Überprüfen, ob alle notwendigen Felder ausgewählt sind
    if (!selectedCustomer || !selectedField) {
        alert('Bitte wählen Sie einen Kunden und ein Feld aus.');
        return;
    }

    // Basispreis für die Fruchtart
    let totalCost = parseFloat(cropPrice);

    // Feldgröße holen
    const fields = loadData('fields');
    const field = fields.find(f => f.name === selectedField);
    if (field) {
        totalCost *= parseFloat(field.size);
        totalCost += parseFloat(field.size)*500;
    } else {
        alert('Fehler: Feldgröße konnte nicht ermittelt werden.');
        return;
    }

    // Rabatt vom Kunden holen
    const customers = loadData('customers');
    const customer = customers.find(c => c.name === selectedCustomer);
    if (customer) {
        const discount = parseFloat(customer.discount);
        totalCost -= (totalCost * (discount / 100));
    } else {
        alert('Fehler: Rabatt konnte nicht ermittelt werden.');
        return;
    }

    // Ergebnis anzeigen
    document.getElementById('costResult').textContent = `Der Kostenvoranschlag beträgt: ${totalCost.toFixed(2)} €`;
}

// Funktion zum Berechnen der Kosten
function calculateCostsDungen() {
    const selectedCustomer = document.getElementById('customerSelect').value;
    const selectedField = document.getElementById('fieldSelect').value;

    // Überprüfen, ob alle notwendigen Felder ausgewählt sind
    if (!selectedCustomer || !selectedField) {
        alert('Bitte wählen Sie einen Kunden und ein Feld aus.');
        return;
    }

    let totalCost = parseFloat(0);

    // Feldgröße holen
    const fields = loadData('fields');
    const field = fields.find(f => f.name === selectedField);
    if (field) {
        totalCost *= parseFloat(field.size);
        totalCost += parseFloat(field.size)*1500;
    } else {
        alert('Fehler: Feldgröße konnte nicht ermittelt werden.');
        return;
    }

    // Rabatt vom Kunden holen
    const customers = loadData('customers');
    const customer = customers.find(c => c.name === selectedCustomer);
    if (customer) {
        const discount = parseFloat(customer.discount);
        totalCost -= (totalCost * (discount / 100));
    } else {
        alert('Fehler: Rabatt konnte nicht ermittelt werden.');
        return;
    }

    // Ergebnis anzeigen
    document.getElementById('costResult').textContent = `Der Kostenvoranschlag beträgt: ${totalCost.toFixed(2)} €`;
}

// Initialisierung der Kunden und Felder beim Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    displayCustomers(loadData('customers'));
    displayFields(loadData('fields'));
});

