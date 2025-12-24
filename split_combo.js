// ฟังก์ชันนับจำนวน lines ที่ไม่ว่าง
function countLines(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
}

// อัพเดทจำนวน accounts แบบ real-time
function updateInputCount() {
  const comboInput = document.getElementById('combo-input').value;
  const count = countLines(comboInput);
  document.getElementById('input-count').innerText = `${count} accounts`;
}

// ฟังการเปลี่ยนแปลงใน textarea
document.addEventListener('DOMContentLoaded', function() {
  const comboInput = document.getElementById('combo-input');
  comboInput.addEventListener('input', updateInputCount);
});

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
        showModal({
            type: 'warning',
            title: 'Input Required',
            message: 'Please fill in the User:Pass:Cookie field.'
        });
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
        showModal({
            type: 'error',
            title: 'Invalid Format',
            message: `Invalid format at line(s): ${errorLines.join(', ')}`
        });
    }

    outputUserPass.textContent = userPassLines.join('\n');
    outputCookie.textContent = cookieLines.join('\n');
    countLabel.textContent = `Total: ${userPassLines.length} accounts`;
}

function clearText() {
    const comboInput = document.getElementById('combo-input').value.trim();
    const hasOutput = document.getElementById('output-user-pass').textContent.trim().length > 0 ||
                      document.getElementById('output-cookie').textContent.trim().length > 0;
    
    if (!comboInput && !hasOutput) {
        showModal({
            type: 'info',
            title: 'No Data',
            message: 'Nothing to clear. Please add some data first.'
        });
        return;
    }
    
    showModal({
        type: 'confirm',
        title: 'Confirm Clear',
        message: 'Are you sure you want to clear all data?',
        confirmText: 'Clear All',
        cancelText: 'Cancel',
        onConfirm: () => {
            document.getElementById('combo-input').value = '';
            document.getElementById('output-user-pass').textContent = '';
            document.getElementById('output-cookie').textContent = '';
            document.getElementById('count-label').textContent = 'Total: 0 accounts';
            updateInputCount();
        }
    });
}

function copyToClipboard(target) {
    let content = '';

    if (target === 'user-pass') {
        content = document.getElementById('output-user-pass').innerText;
    } else if (target === 'cookie') {
        content = document.getElementById('output-cookie').innerText;
    }

    if (content.trim() === '') {
        showModal({
            type: 'info',
            title: 'No Data',
            message: 'No data to copy!'
        });
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
        showModal({
            type: 'success',
            title: 'Copied!',
            message: 'Copied to clipboard!'
        });
    }).catch(err => {
        showModal({
            type: 'error',
            title: 'Copy Failed',
            message: 'Error copying to clipboard!'
        });
        console.error('Error copying text: ', err);
    });
}
