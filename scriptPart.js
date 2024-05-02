let formattedData; // Declare formattedData in the global scope

const names = [];
document.getElementById('nameForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const input = document.getElementById('nameInput');
    const name = input.value.trim();

    if (name) {
        names.push(name);
        const li = document.createElement('li');
        li.textContent = name;
        document.getElementById('nameList').appendChild(li);
        input.value = ''; // Clear input after adding
        updateNameDropdowns(); // Update dropdowns whenever a new name is added
    }
});

function updateNameDropdowns() {
    const dropdowns = document.querySelectorAll('.name-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.innerHTML = '<option value="">Select name</option>'; // Clear existing options first
        names.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            dropdown.appendChild(option);
        });
    });
}

function transformReceiptData(jsonData) {
    const prediction = jsonData.document.inference.pages[0].prediction;
    return {
        line_items: prediction.line_items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            total_amount: item.total_amount
        })),
        total_tax: prediction.total_tax.value,
        total_amount: prediction.total_amount.value
    };
}

document.addEventListener('DOMContentLoaded', function() {
    const receiptDataJSON = localStorage.getItem('receiptData');
    if (!receiptDataJSON) {
        console.error("No receipt data found in local storage.");
        return;
    }

    const receiptData = JSON.parse(receiptDataJSON);
    formattedData = transformReceiptData(receiptData);  // Assign to global variable

    const itemsTable = document.getElementById('receiptDetails').getElementsByTagName('tbody')[0];
    formattedData.line_items.forEach(item => {
        let row = itemsTable.insertRow();
        row.insertCell(0).textContent = item.description;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = `$${item.total_amount.toFixed(2)}`;
        let cell = row.insertCell(3);
        let select = document.createElement('select');
        select.className = 'name-dropdown';
        select.required = true;
        cell.appendChild(select);
    });

    updateNameDropdowns();

    document.getElementById('totalTax').textContent = `Tax: $${formattedData.total_tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `Total: $${formattedData.total_amount.toFixed(2)}`;
});

document.getElementById('nextPageBtn').addEventListener('click', function() {
    const assignedItems = {};
    const dropdowns = document.querySelectorAll('.name-dropdown');
    dropdowns.forEach((dropdown, index) => {
        const name = dropdown.value;
        const item = formattedData.line_items[index];
        if (name) {
            if (!assignedItems[name]) {
                assignedItems[name] = {
                    items: [],
                    tax: 0,
                    total: 0
                };
            }
            assignedItems[name].items.push(item);
            assignedItems[name].total += item.total_amount;
        }
    });

    const totalPeople = Object.keys(assignedItems).length;
    const taxPerPerson = formattedData.total_tax / totalPeople;
    Object.keys(assignedItems).forEach(name => {
        assignedItems[name].tax = taxPerPerson;
        assignedItems[name].total += taxPerPerson;
    });

    localStorage.setItem('individualBills', JSON.stringify(assignedItems));
    window.location.href = 'individualBills.html'; // Redirect to individual bills page
});
