function combineUserPassCookie() {
    const userPassInput = document.getElementById('user-pass-input').value.trim();
    const cookieInput = document.getElementById('cookie-input').value.trim();
    const output = document.getElementById('output-text');
    const countLabel = document.getElementById('count-label');
    output.innerHTML = ''; // Clear output

    if (!userPassInput || !cookieInput) {
        alert('Please fill in both User:Pass and Cookie fields.');
        return;
    }

    const userPassLines = userPassInput.split('\n');
    const cookieLines = cookieInput.split('\n');
    let validLines = 0;

    // Validate line counts
    if (userPassLines.length !== cookieLines.length) {
        alert('The number of lines in User:Pass and Cookie must be equal.');
        return;
    }

    const combinedLines = [];
    for (let i = 0; i < userPassLines.length; i++) {
        const userPass = userPassLines[i].trim();
        const cookie = cookieLines[i].trim();

        // Validate User:Pass format
        if (!/^[^:]+:[^:]+$/.test(userPass)) {
            alert(`Invalid format in User:Pass at line ${i + 1}: "${userPass}"`);
            return;
        }

        combinedLines.push(`${userPass}:${cookie}`);
        validLines++;
    }

    output.textContent = combinedLines.join('\n');
    countLabel.textContent = `Total: ${validLines} accounts`;}

function clearText() {
    document.getElementById('user-pass-input').value = '';
    document.getElementById('cookie-input').value = '';
    document.getElementById('output-text').textContent = '';
    document.getElementById('count-label').textContent = 'Total: 0 usernames';
}

function copyToClipboard() {
    const output = document.getElementById('output-text').innerText;
    if (!output) {
        alert('No data to copy!');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        alert('Combo copied to clipboard!');
    });
}