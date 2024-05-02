document.addEventListener('DOMContentLoaded', function() {
    const billsDataJSON = localStorage.getItem('individualBills');
    const billsData = JSON.parse(billsDataJSON);
    const container = document.getElementById('individualBillsContainer');

    if (!billsData) {
        console.error("No bills data found in local storage.");
        container.innerHTML = '<p>No bills data available. Please ensure the data was saved correctly.</p>';
        return;
    }

    Object.keys(billsData).forEach(name => {
        const data = billsData[name];
        const section = document.createElement('section');
        section.innerHTML = `<h2>${name}'s Bill</h2>`;
        const list = document.createElement('ul');
        data.items.forEach(item => {
            list.innerHTML += `<li>${item.description}: ${item.quantity} x $${item.total_amount.toFixed(2)}</li>`;
        });
        list.innerHTML += `<li>Tax: $${data.tax.toFixed(2)}</li>`;
        list.innerHTML += `<li>Total: $${data.total.toFixed(2)}</li>`;
        section.appendChild(list);
        container.appendChild(section);
    });
});
