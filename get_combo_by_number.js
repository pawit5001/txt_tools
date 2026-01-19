// ฟังก์ชันนับจำนวน lines ที่ไม่ว่าง
function countLines(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
}

const comboInput = document.getElementById('combo-input');
const comboFileUpload = document.getElementById('combo-file-upload');

// อัพเดทจำนวน accounts แบบ real-time
function updateInputCount() {
  const count = countLines(comboInput.value);
  document.getElementById('input-count').innerText = `${count} accounts`;
}

// โหลดไฟล์ .txt หลายไฟล์
function setupFileUpload() {
  comboFileUpload.addEventListener('change', (e) => {
    const files = e.target.files;
    let allText = '';
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
      if (file.type !== 'text/plain') {
        showModal({
          type: 'warning',
          title: 'Invalid File Type',
          message: `File "${file.name}" is not a txt file and will be ignored.`
        });
        filesProcessed++;
        checkAllProcessed();
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        allText += evt.target.result.trim() + '\n';
        filesProcessed++;
        checkAllProcessed();
      };
      reader.readAsText(file);
    });

    function checkAllProcessed() {
      if (filesProcessed === files.length) {
        const existingText = comboInput.value.trim();
        if (existingText) {
          comboInput.value = existingText + '\n' + allText.trim();
        } else {
          comboInput.value = allText.trim();
        }
        updateInputCount();
      }
    }
  });
}

// รองรับ drag & drop
function setupDragDrop() {
  comboInput.addEventListener('dragover', (e) => {
    e.preventDefault();
    comboInput.classList.add('ring', 'ring-blue-400');
  });
  
  comboInput.addEventListener('dragleave', (e) => {
    e.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');
  });
  
  comboInput.addEventListener('drop', (e) => {
    e.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');
    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    let allText = '';
    let filesProcessed = 0;

    Array.from(files).forEach(file => {
      if (file.type !== 'text/plain') {
        showModal({
          type: 'warning',
          title: 'Invalid File Type',
          message: `File "${file.name}" is not a txt file and will be ignored.`
        });
        filesProcessed++;
        checkAllProcessed();
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        allText += evt.target.result.trim() + '\n';
        filesProcessed++;
        checkAllProcessed();
      };
      reader.readAsText(file);
    });

    function checkAllProcessed() {
      if (filesProcessed === files.length) {
        const existingText = comboInput.value.trim();
        if (existingText) {
          comboInput.value = existingText + '\n' + allText.trim();
        } else {
          comboInput.value = allText.trim();
        }
        updateInputCount();
      }
    }
  });
}

// ตั้งค่า event listeners เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', function() {
  comboInput.addEventListener('input', updateInputCount);
  setupFileUpload();
  setupDragDrop();

  // Paste handler (comboInput)
  comboInput.addEventListener('paste', async (e) => {
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
          const existingText = comboInput.value.trim();
          if (existingText) {
            comboInput.value = existingText + '\n' + allText.trim();
          } else {
            comboInput.value = allText.trim();
          }
          updateInputCount();
        }
      };
      reader.readAsText(file);
    });
  });

  // Drag & drop handler (comboInput)
  comboInput.addEventListener('dragover', (e) => {
    e.preventDefault();
    comboInput.classList.add('ring', 'ring-blue-400');
  });
  comboInput.addEventListener('dragleave', (e) => {
    e.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');
  });
  comboInput.addEventListener('drop', async (e) => {
    e.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');
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
          const existingText = comboInput.value.trim();
          if (existingText) {
            comboInput.value = existingText + '\n' + allText.trim();
          } else {
            comboInput.value = allText.trim();
          }
          updateInputCount();
        }
      };
      reader.readAsText(file);
    });
  });
});

function getComboByNumber() {
    const comboInput = document.getElementById('combo-input').value.trim();
    const count = parseInt(document.getElementById('combo-count').value.trim());

    const outputExtracted = document.getElementById('output-extracted');
    const outputRemaining = document.getElementById('output-remaining');

    // clear old results
    outputExtracted.textContent = '';
    outputRemaining.textContent = '';

    if (!comboInput) {
        showModal({
            type: 'warning',
            title: 'Input Required',
            message: 'Please enter combos (user:pass:cookie).'
        });
        return;
    }

    if (isNaN(count) || count <= 0) {
        showModal({
            type: 'warning',
            title: 'Invalid Number',
            message: 'Please enter a valid number.'
        });
        return;
    }

    // split by line
    const comboLines = comboInput.split(/\r?\n/).filter(line => line.trim() !== '');
    const total = comboLines.length;

    if (count > total) {
        showModal({
            type: 'error',
            title: 'Number Too Large',
            message: `Number entered (${count}) exceeds total combos (${total}).`
        });
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
    showToast({
      type: 'warning',
      message: 'No data to copy.'
    });
        return;
    }

    navigator.clipboard.writeText(content).then(() => {
    showToast({
      type: 'success',
      message: target === 'extracted' ? 'Extracted combo copied.' : 'Remaining combo copied.'
    });
    }).catch(err => {
    showToast({
      type: 'error',
      message: 'Copy failed. Try again.'
    });
    console.error('Error copying text: ', err);
    });
}

function clearText() {
    const hasCombo = document.getElementById('combo-input').value.trim().length > 0;
    const hasCount = document.getElementById('combo-count').value.trim().length > 0;
    const hasOutput = document.getElementById('output-extracted').textContent.trim().length > 0 ||
                      document.getElementById('output-remaining').textContent.trim().length > 0;
    
    if (!hasCombo && !hasCount && !hasOutput) {
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
            document.getElementById('combo-count').value = '';
            document.getElementById('output-extracted').textContent = '';
            document.getElementById('output-remaining').textContent = '';
            document.getElementById('count-label-extracted').textContent = 'Total Extracted: 0 accounts';
            document.getElementById('count-label-remaining').textContent = 'Total Remaining: 0 accounts';
            document.getElementById('combo-file-upload').value = '';
            updateInputCount();
        }
    });
}
