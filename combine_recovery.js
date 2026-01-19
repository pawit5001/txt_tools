// ฟังก์ชันนับจำนวน lines ที่ไม่ว่าง
function countLines(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
}

const file1Input = document.getElementById('file1-input');
const file2Input = document.getElementById('file2-input');
const file1Upload = document.getElementById('file1-upload');
const file2Upload = document.getElementById('file2-upload');

// อัพเดทจำนวน lines แบบ real-time
function updateInputCounts() {
  const file1Count = countLines(file1Input.value);
  const file2Count = countLines(file2Input.value);
  document.getElementById('file1-count').innerText = `${file1Count} lines`;
  document.getElementById('file2-count').innerText = `${file2Count} lines`;
}

// ฟังการเปลี่ยนแปลงใน textarea
file1Input.addEventListener('input', updateInputCounts);
file2Input.addEventListener('input', updateInputCounts);

// โหลดไฟล์ .txt หลายไฟล์
function setupFileUpload(fileInput, textareaId) {
  fileInput.addEventListener('change', (e) => {
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
        const textArea = document.getElementById(textareaId);
        const existingText = textArea.value.trim();
        if (existingText) {
          textArea.value = existingText + '\n' + allText.trim();
        } else {
          textArea.value = allText.trim();
        }
        updateInputCounts();
      }
    }
  });
}

// รองรับ drag & drop
function setupDragDrop(textareaId, fileInputId) {
  const textArea = document.getElementById(textareaId);
  
  textArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    textArea.classList.add('ring', 'ring-blue-400');
  });
  
  textArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    textArea.classList.remove('ring', 'ring-blue-400');
  });
  
  textArea.addEventListener('drop', (e) => {
    e.preventDefault();
    textArea.classList.remove('ring', 'ring-blue-400');
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
        const existingText = textArea.value.trim();
        if (existingText) {
          textArea.value = existingText + '\n' + allText.trim();
        } else {
          textArea.value = allText.trim();
        }
        updateInputCounts();
      }
    }
  });
}

// ตั้งค่า event listeners เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', function() {
  setupFileUpload(file1Upload, 'file1-input');
  setupFileUpload(file2Upload, 'file2-input');
  setupDragDrop('file1-input', 'file1-upload');
  setupDragDrop('file2-input', 'file2-upload');

  // Paste handler (file1-input, file2-input)
  ['file1-input', 'file2-input'].forEach(id => {
    const textarea = document.getElementById(id);
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

  // Drag & drop handler (file1-input, file2-input)
  ['file1-input', 'file2-input'].forEach(id => {
    const textarea = document.getElementById(id);
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

// ฟังก์ชันรวมข้อมูล 2 ไฟล์
function combineRecovery() {
  const file1Input = document.getElementById('file1-input').value.trim();
  const file2Input = document.getElementById('file2-input').value.trim();
  const output = document.getElementById('output-text');
  const countLabel = document.getElementById('count-label');
  output.innerHTML = ''; // Clear output

  if (!file1Input || !file2Input) {
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please fill in both fields.'
    });
    return;
  }

  const file1Lines = file1Input.split(/\r?\n/);
  const file2Lines = file2Input.split(/\r?\n/);
  let validLines = 0;
  const combinedLines = [];

  // Validate line counts
  if (file1Lines.length !== file2Lines.length) {
    showModal({
      type: 'error',
      title: 'Line Count Mismatch',
      message: `Line count mismatch!\nFirst data: ${file1Lines.length} lines\nSecond data: ${file2Lines.length} lines`
    });
    return;
  }

  // Combine lines
  for (let i = 0; i < file1Lines.length; i++) {
    const line1 = file1Lines[i].trim();
    const line2 = file2Lines[i].trim();

    // Skip empty lines
    if (!line1 || !line2) {
      continue;
    }

    combinedLines.push(`${line1}:${line2}`);
    validLines++;
  }

  if (validLines === 0) {
    showModal({
      type: 'warning',
      title: 'No Data',
      message: 'No valid lines to combine!'
    });
    return;
  }

  output.textContent = combinedLines.join('\n');
  countLabel.textContent = `Total: ${validLines} combined lines`;
}

// ฟังก์ชันล้างข้อมูล
function clearText() {
  const hasFile1 = document.getElementById('file1-input').value.trim().length > 0;
  const hasFile2 = document.getElementById('file2-input').value.trim().length > 0;
  const hasOutput = document.getElementById('output-text').textContent.trim().length > 0;
  
  if (!hasFile1 && !hasFile2 && !hasOutput) {
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
      document.getElementById('file1-input').value = '';
      document.getElementById('file2-input').value = '';
      document.getElementById('output-text').textContent = '';
      document.getElementById('count-label').textContent = 'Total: 0 combined lines';
      document.getElementById('file1-upload').value = '';
      document.getElementById('file2-upload').value = '';
      updateInputCounts();
    }
  });
}

// ฟังก์ชันคัดลอกไปยังคลิปบอร์ด
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

// ฟังก์ชันดาวน์โหลดไฟล์
function downloadOutput() {
  const output = document.getElementById('output-text').innerText;
  if (!output) {
    showModal({
      type: 'info',
      title: 'No Data',
      message: 'No data to download!'
    });
    return;
  }

  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
  element.setAttribute('download', 'combined_output.txt');
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
