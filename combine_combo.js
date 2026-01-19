// ฟังก์ชันนับจำนวน lines ที่ไม่ว่าง
function countLines(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
}

// อัพเดทจำนวน accounts แบบ real-time
function updateInputCounts() {
  const userPassInput = document.getElementById('user-pass-input').value;
  const cookieInput = document.getElementById('cookie-input').value;
  const userPassCount = countLines(userPassInput);
  const cookieCount = countLines(cookieInput);
  document.getElementById('userpass-count').innerText = `${userPassCount} accounts`;
  document.getElementById('cookie-count').innerText = `${cookieCount} accounts`;
}

// ฟังการเปลี่ยนแปลงใน textarea
document.addEventListener('DOMContentLoaded', function() {
    const userPassInput = document.getElementById('user-pass-input');
    const cookieInput = document.getElementById('cookie-input');
    userPassInput.addEventListener('input', updateInputCounts);
    cookieInput.addEventListener('input', updateInputCounts);

    // Paste handler (userPassInput, cookieInput)
    [userPassInput, cookieInput].forEach(textarea => {
        textarea.addEventListener('paste', async (e) => {
            if (!e.clipboardData || !e.clipboardData.items) return;
            const items = Array.from(e.clipboardData.items);
            let allText = '';
            let filesToRead = [];

            async function getFilesFromItem(item) {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file && /\.txt$/i.test(file.name)) {
                        return [file];
                    }
                    if (item.webkitGetAsEntry) {
                        const entry = item.webkitGetAsEntry();
                        if (entry && entry.isDirectory) {
                            return await readAllTxtFilesFromDirectory(entry);
                        }
                    }
                }
                return [];
            }

            async function readAllTxtFilesFromDirectory(entry) {
                let files = [];
                const reader = entry.createReader();
                const readEntries = () => new Promise(resolve => reader.readEntries(resolve));
                let entries = await readEntries();
                while (entries.length) {
                    for (const ent of entries) {
                        if (ent.isFile && /\.txt$/i.test(ent.name)) {
                            files.push(await new Promise(res => ent.file(res)));
                        } else if (ent.isDirectory) {
                            files = files.concat(await readAllTxtFilesFromDirectory(ent));
                        }
                    }
                    entries = await readEntries();
                }
                return files;
            }

            for (const item of items) {
                const files = await getFilesFromItem(item);
                filesToRead = filesToRead.concat(files);
            }

            if (filesToRead.length === 0) return;
            e.preventDefault();
            let filesProcessed = 0;
            filesToRead.forEach(file => {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    allText += evt.target.result.trim() + '\n';
                    filesProcessed++;
                    if (filesProcessed === filesToRead.length) {
                        const existingText = textarea.value.trim();
                        if (existingText) {
                            textarea.value = existingText + '\n' + allText.trim();
                        } else {
                            textarea.value = allText.trim();
                        }
                        updateInputCounts();
                    }
                };
                reader.readAsText(file);
            });
        });
    });

    // Drag & drop handler (userPassInput, cookieInput)
    [userPassInput, cookieInput].forEach(textarea => {
        textarea.addEventListener('dragover', (e) => {
            e.preventDefault();
            textarea.classList.add('ring', 'ring-blue-400');
        });
        textarea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            textarea.classList.remove('ring', 'ring-blue-400');
        });
        textarea.addEventListener('drop', async (e) => {
            e.preventDefault();
            textarea.classList.remove('ring', 'ring-blue-400');
            const items = e.dataTransfer.items;
            if (!items || items.length === 0) return;
            let allText = '';
            let filesToRead = [];
            async function getFilesFromItem(item) {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    if (file && /\.txt$/i.test(file.name)) {
                        return [file];
                    }
                    if (item.webkitGetAsEntry) {
                        const entry = item.webkitGetAsEntry();
                        if (entry && entry.isDirectory) {
                            return await readAllTxtFilesFromDirectory(entry);
                        }
                    }
                }
                return [];
            }
            async function readAllTxtFilesFromDirectory(entry) {
                let files = [];
                const reader = entry.createReader();
                const readEntries = () => new Promise(resolve => reader.readEntries(resolve));
                let entries = await readEntries();
                while (entries.length) {
                    for (const ent of entries) {
                        if (ent.isFile && /\.txt$/i.test(ent.name)) {
                            files.push(await new Promise(res => ent.file(res)));
                        } else if (ent.isDirectory) {
                            files = files.concat(await readAllTxtFilesFromDirectory(ent));
                        }
                    }
                    entries = await readEntries();
                }
                return files;
            }
            for (const item of items) {
                const files = await getFilesFromItem(item);
                filesToRead = filesToRead.concat(files);
            }
            if (filesToRead.length === 0) return;
            let filesProcessed = 0;
            filesToRead.forEach(file => {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    allText += evt.target.result.trim() + '\n';
                    filesProcessed++;
                    if (filesProcessed === filesToRead.length) {
                        const existingText = textarea.value.trim();
                        if (existingText) {
                            textarea.value = existingText + '\n' + allText.trim();
                        } else {
                            textarea.value = allText.trim();
                        }
                        updateInputCounts();
                    }
                };
                reader.readAsText(file);
            });
        });
    });
});

function combineUserPassCookie() {
    const userPassInput = document.getElementById('user-pass-input').value.trim();
    const cookieInput = document.getElementById('cookie-input').value.trim();
    const output = document.getElementById('output-text');
    const countLabel = document.getElementById('count-label');
    output.innerHTML = ''; // Clear output

    if (!userPassInput || !cookieInput) {
        showModal({
            type: 'warning',
            title: 'Input Required',
            message: 'Please fill in both User:Pass and Cookie fields.'
        });
        return;
    }

    const userPassLines = userPassInput.split('\n');
    const cookieLines = cookieInput.split('\n');
    let validLines = 0;

    // Validate line counts
    if (userPassLines.length !== cookieLines.length) {
        showModal({
            type: 'error',
            title: 'Line Count Mismatch',
            message: 'The number of lines in User:Pass and Cookie must be equal.'
        });
        return;
    }

    const combinedLines = [];
    for (let i = 0; i < userPassLines.length; i++) {
        const userPass = userPassLines[i].trim();
        const cookie = cookieLines[i].trim();

        // Validate User:Pass format
        if (!/^[^:]+:[^:]+$/.test(userPass)) {
            showModal({
                type: 'error',
                title: 'Invalid Format',
                message: `Invalid format in User:Pass at line ${i + 1}: "${userPass}"`
            });
            return;
        }

        combinedLines.push(`${userPass}:${cookie}`);
        validLines++;
    }

    output.textContent = combinedLines.join('\n');
    countLabel.textContent = `Total: ${validLines} accounts`;}

function clearText() {
    const hasUserPass = document.getElementById('user-pass-input').value.trim().length > 0;
    const hasCookie = document.getElementById('cookie-input').value.trim().length > 0;
    const hasOutput = document.getElementById('output-text').textContent.trim().length > 0;
    
    if (!hasUserPass && !hasCookie && !hasOutput) {
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
            document.getElementById('user-pass-input').value = '';
            document.getElementById('cookie-input').value = '';
            document.getElementById('output-text').textContent = '';
            document.getElementById('count-label').textContent = 'Total: 0 usernames';
            updateInputCounts();
        }
    });
}

function copyToClipboard() {
    const output = document.getElementById('output-text').innerText;
    if (!output) {
        showToast({
            type: 'warning',
            message: 'No data to copy.'
        });
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showToast({
            type: 'success',
            message: 'Copied to clipboard.'
        });
    }).catch(() => {
        showToast({
            type: 'error',
            message: 'Copy failed. Try again.'
        });
    });
}