function splitComboData() {
    const comboInput = document.getElementById('combo-input').value.trim();
    const outputUserPass = document.getElementById('output-user-pass');
    const outputCookie = document.getElementById('output-cookie');
    const countLabel = document.getElementById('count-label');

    // เคลียร์ผลลัพธ์เก่า
    outputUserPass.innerHTML = '';
    outputCookie.innerHTML = '';
    countLabel.textContent = 'Total: 0 accounts';

    if (!comboInput) {
        alert('Please fill in the User:Pass:Cookie field.');
        return;
    }

    const comboLines = comboInput.split(/\r?\n/);
    const userPassLines = [];
    const cookieLines = [];
    const errorLines = [];

    comboLines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed === '') return; // ข้ามบรรทัดว่าง

        const parts = trimmed.split(':');
        if (parts.length < 3) {
            errorLines.push(index + 1);
            return;
        }

        const userPass = `${parts[0]}:${parts[1]}`;
        const cookie = parts.slice(2).join(':');

        if (!userPass || !cookie) {
            errorLines.push(index + 1);
            return;
        }

        userPassLines.push(userPass);
        cookieLines.push(cookie);
    });

    if (errorLines.length > 0) {
        alert(`Invalid format at line(s): ${errorLines.join(', ')}`);
    }

    outputUserPass.textContent = userPassLines.join('\n');
    outputCookie.textContent = cookieLines.join('\n');
    countLabel.textContent = `Total: ${userPassLines.length} accounts`;
}

function clearText() {
    document.getElementById('combo-input').value = '';
    document.getElementById('output-user-pass').textContent = '';
    document.getElementById('output-cookie').textContent = '';
    document.getElementById('count-label').textContent = 'Total: 0 accounts';
}

function copyToClipboard(target) {
    let content = '';

    if (target === 'user-pass') {
        content = document.getElementById('output-user-pass').innerText;
    } else if (target === 'cookie') {
        content = document.getElementById('output-cookie').innerText;
    }

    if (content.trim() === '') {
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
