function getComboByNumber() {
    const comboInput = document.getElementById('combo-input').value.trim();
    const count = parseInt(document.getElementById('combo-count').value.trim());

    const outputExtracted = document.getElementById('output-extracted');
    const outputRemaining = document.getElementById('output-remaining');

    // clear old results
    outputExtracted.textContent = '';
    outputRemaining.textContent = '';

    if (!comboInput) {
        alert('Please enter combos (user:pass:cookie).');
        return;
    }

    if (isNaN(count) || count <= 0) {
        alert('Please enter a valid number.');
        return;
    }

    // split by line
    const comboLines = comboInput.split(/\r?\n/).filter(line => line.trim() !== '');
    const total = comboLines.length;

    if (count > total) {
        alert(`Number entered (${count}) exceeds total combos (${total}).`);
        return;
    }

    const extracted = comboLines.slice(0, count).join('\n');
    const remaining = comboLines.slice(count).join('\n');

    outputExtracted.textContent = extracted;
    outputRemaining.textContent = remaining;

    // update counters
    document.getElementById('count-label-extracted').textContent = `Total Extracted: ${count} accounts`;
    document.getElementById('count-label-remaining').textContent = `Total Remaining: ${total - count} accounts`;
}

function copyToClipboard(target) {
    let content = '';
    if (target === 'extracted') {
        content = document.getElementById('output-extracted').textContent;
    } else if (target === 'remaining') {
        content = document.getElementById('output-remaining').textContent;
    }

    if (!content.trim()) {
        alert('No data to copy!');
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
        alert('Copied to clipboard!');
    }).catch(err => {
        alert('Error copying to clipboard!');
        console.error('Error copying text: ', err);
    });
}

function clearText() {
    document.getElementById('combo-input').value = '';
    document.getElementById('combo-count').value = '';
    document.getElementById('output-extracted').textContent = '';
    document.getElementById('output-remaining').textContent = '';
    document.getElementById('count-label-extracted').textContent = 'Total Extracted: 0 accounts';
    document.getElementById('count-label-remaining').textContent = 'Total Remaining: 0 accounts';
}
