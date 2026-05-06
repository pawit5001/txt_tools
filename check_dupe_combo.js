function countLines(text) {
  if (!text.trim()) return 0;
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0).length;
}

function updateInputCount() {
  const comboInput = document.getElementById('combo-input').value;
  document.getElementById('input-count').innerText = `${countLines(comboInput)} lines`;
}

function resetStats() {
  document.getElementById('unique-count').textContent = '0';
  document.getElementById('duplicate-key-count').textContent = '0';
  document.getElementById('removed-count').textContent = '0';
  document.getElementById('count-label').textContent = 'Total: 0 lines';
}

function appendTextFromFiles(textarea, filesToRead) {
  if (filesToRead.length === 0) {
    return;
  }

  let mergedText = '';
  let filesProcessed = 0;

  filesToRead.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      mergedText += `${String(event.target.result).trim()}\n`;
      filesProcessed += 1;

      if (filesProcessed === filesToRead.length) {
        const existingText = textarea.value.trim();
        textarea.value = existingText
          ? `${existingText}\n${mergedText.trim()}`
          : mergedText.trim();
        updateInputCount();
      }
    };
    reader.readAsText(file);
  });
}

function appendFileListToTextarea(textarea, files) {
  const textFiles = Array.from(files).filter((file) => /\.txt$/i.test(file.name));

  if (textFiles.length === 0) {
    return false;
  }

  appendTextFromFiles(textarea, textFiles);
  return true;
}

async function readAllTxtFilesFromDirectory(entry) {
  let files = [];
  const reader = entry.createReader();
  const readEntries = () => new Promise((resolve) => reader.readEntries(resolve));

  let entries = await readEntries();
  while (entries.length) {
    for (const childEntry of entries) {
      if (childEntry.isFile && /\.txt$/i.test(childEntry.name)) {
        files.push(await new Promise((resolve) => childEntry.file(resolve)));
      } else if (childEntry.isDirectory) {
        files = files.concat(await readAllTxtFilesFromDirectory(childEntry));
      }
    }
    entries = await readEntries();
  }

  return files;
}

async function getFilesFromDataTransferItems(items) {
  let filesToRead = [];

  async function getFilesFromItem(item) {
    if (item.kind !== 'file') {
      return [];
    }

    const file = item.getAsFile();
    if (file && /\.txt$/i.test(file.name)) {
      return [file];
    }

    if (item.webkitGetAsEntry) {
      const entry = item.webkitGetAsEntry();
      if (entry && entry.isDirectory) {
        return readAllTxtFilesFromDirectory(entry);
      }
    }

    return [];
  }

  for (const item of items) {
    filesToRead = filesToRead.concat(await getFilesFromItem(item));
  }

  return filesToRead;
}

document.addEventListener('DOMContentLoaded', function() {
  const comboInput = document.getElementById('combo-input');
  const fileInput = document.getElementById('file-input');

  comboInput.addEventListener('input', updateInputCount);

  fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const appended = appendFileListToTextarea(comboInput, files);
    if (!appended) {
      showModal({
        type: 'warning',
        title: 'Invalid File Type',
        message: 'Only .txt files are supported.'
      });
    }

    fileInput.value = '';
  });

  comboInput.addEventListener('paste', async (event) => {
    if (!event.clipboardData) {
      return;
    }

    const directFiles = event.clipboardData.files;
    if (directFiles && directFiles.length > 0) {
      event.preventDefault();
      appendFileListToTextarea(comboInput, directFiles);
      return;
    }

    if (!event.clipboardData.items) {
      return;
    }

    const filesToRead = await getFilesFromDataTransferItems(Array.from(event.clipboardData.items));
    if (filesToRead.length === 0) {
      return;
    }

    event.preventDefault();
    appendTextFromFiles(comboInput, filesToRead);
  });

  comboInput.addEventListener('dragover', (event) => {
    event.preventDefault();
    comboInput.classList.add('ring', 'ring-blue-400');
  });

  comboInput.addEventListener('dragleave', (event) => {
    event.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');
  });

  comboInput.addEventListener('drop', async (event) => {
    event.preventDefault();
    comboInput.classList.remove('ring', 'ring-blue-400');

    const items = event.dataTransfer?.items;
    const files = event.dataTransfer?.files;

    if (files && files.length > 0) {
      appendFileListToTextarea(comboInput, files);
      return;
    }

    if (!items || items.length === 0) {
      return;
    }

    const filesToRead = await getFilesFromDataTransferItems(Array.from(items));
    appendTextFromFiles(comboInput, filesToRead);
  });

  resetStats();
});

function checkDupeCombo() {
  const comboInput = document.getElementById('combo-input').value;
  const output = document.getElementById('output-text');
  const lines = comboInput.split(/\r?\n/);

  output.textContent = '';
  resetStats();

  if (!comboInput.trim()) {
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please enter combo data before checking duplicates.'
    });
    return;
  }

  const seenKeys = new Set();
  const uniqueLines = [];
  const duplicateMap = new Map();
  const invalidLines = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      return;
    }

    const separatorIndex = trimmedLine.indexOf(':');
    if (separatorIndex <= 0) {
      invalidLines.push(index + 1);
      return;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    if (!key) {
      invalidLines.push(index + 1);
      return;
    }

    if (seenKeys.has(key)) {
      duplicateMap.set(key, (duplicateMap.get(key) || 1) + 1);
      return;
    }

    seenKeys.add(key);
    duplicateMap.set(key, 1);
    uniqueLines.push(trimmedLine);
  });

  output.textContent = uniqueLines.join('\n');

  const duplicateEntries = Array.from(duplicateMap.entries())
    .filter(([, count]) => count > 1)
    .sort((firstEntry, secondEntry) => secondEntry[1] - firstEntry[1]);

  const removedCount = countLines(comboInput) - uniqueLines.length - invalidLines.length;

  document.getElementById('unique-count').textContent = String(uniqueLines.length);
  document.getElementById('duplicate-key-count').textContent = String(duplicateEntries.length);
  document.getElementById('removed-count').textContent = String(Math.max(removedCount, 0));
  document.getElementById('count-label').textContent = `Total: ${uniqueLines.length} lines`;

  if (invalidLines.length > 0) {
    showModal({
      type: 'warning',
      title: 'Invalid Lines Skipped',
      message: `These lines do not contain a valid key before ':': ${invalidLines.join(', ')}`
    });
    return;
  }

  if (duplicateEntries.length === 0) {
    showModal({
      type: 'success',
      title: 'No Duplicates Found',
      message: `Checked ${uniqueLines.length} valid line(s). No duplicate keys were found.`
    });
    return;
  }

  const duplicateSummary = duplicateEntries
    .slice(0, 8)
    .map(([key, count]) => `${key} duplicated ${count} times`)
    .join('\n');

  const remainingSummary = duplicateEntries.length > 8
    ? `\n+${duplicateEntries.length - 8} more duplicate key(s)`
    : '';

  showModal({
    type: 'info',
    title: 'Duplicate Summary',
    message: `Removed ${Math.max(removedCount, 0)} duplicate line(s) across ${duplicateEntries.length} key(s).\n\n${duplicateSummary}${remainingSummary}`
  });
}

function clearText() {
  const comboInput = document.getElementById('combo-input').value.trim();
  const hasOutput = document.getElementById('output-text').textContent.trim().length > 0;

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
      document.getElementById('output-text').textContent = '';
      updateInputCount();
      resetStats();
    }
  });
}

function copyToClipboard() {
  const output = document.getElementById('output-text').textContent;

  if (!output.trim()) {
    showToast({
      type: 'warning',
      message: 'No output to copy.'
    });
    return;
  }

  navigator.clipboard.writeText(output).then(() => {
    showToast({
      type: 'success',
      message: 'Filtered output copied.'
    });
  }).catch((error) => {
    showToast({
      type: 'error',
      message: 'Copy failed. Try again.'
    });
    console.error('Error copying text:', error);
  });
}