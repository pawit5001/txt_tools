const userPassInput = document.getElementById('user-pass-input');
const fileInput = document.getElementById('file-input');
const cookieInput = document.getElementById('cookie-input');

// โหลดไฟล์ .txt หลายไฟล์ เข้า textarea user-pass-input
fileInput.addEventListener('change', (e) => {
  const files = e.target.files;
  let allText = '';
  let filesProcessed = 0;

  Array.from(files).forEach(file => {
    if (file.type !== 'text/plain') {
      alert(`File "${file.name}" is not a txt file and will be ignored.`);
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
      userPassInput.value = (userPassInput.value.trim() ? userPassInput.value.trim() + '\n' : '') + allText.trim();
    }
  }
});

// รองรับ drag & drop ไฟล์เข้า textarea ด้วย
userPassInput.addEventListener('dragover', (e) => {
  e.preventDefault();
  userPassInput.classList.add('ring', 'ring-blue-400');
});
userPassInput.addEventListener('dragleave', (e) => {
  e.preventDefault();
  userPassInput.classList.remove('ring', 'ring-blue-400');
});
userPassInput.addEventListener('drop', (e) => {
  e.preventDefault();
  userPassInput.classList.remove('ring', 'ring-blue-400');
  const files = e.dataTransfer.files;
  if (files.length === 0) return;

  let allText = '';
  let filesProcessed = 0;

  Array.from(files).forEach(file => {
    if (file.type !== 'text/plain') {
      alert(`File "${file.name}" is not a txt file and will be ignored.`);
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
      userPassInput.value = (userPassInput.value.trim() ? userPassInput.value.trim() + '\n' : '') + allText.trim();
    }
  }
});

// auto new line เวลาวางหลาย username ในช่อง Username
cookieInput.addEventListener('paste', (e) => {
  e.preventDefault();
  const pasteText = (e.clipboardData || window.clipboardData).getData('text');
  const lines = pasteText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  const currentLines = cookieInput.value.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const newLines = [...currentLines, ...lines];

  cookieInput.value = newLines.join('\n');
});

// ฟังก์ชันตรวจสอบ format combo แต่ละบรรทัด
function validateComboFormat(lines) {
  const invalidLines = [];
  lines.forEach((line, i) => {
    if (!/^[^:]+:[^:]+:.+$/.test(line)) {
      invalidLines.push(i + 1);
    }
  });
  return invalidLines;
}

// main process function
function processCombo() {
  const comboLinesRaw = userPassInput.value.trim();
  const usernameLinesRaw = cookieInput.value.trim();

  if (!comboLinesRaw) {
    alert('Please enter User:Pass:Cookie data.');
    return;
  }
  if (!usernameLinesRaw) {
    alert('Please enter username(s).');
    return;
  }

  const comboLines = comboLinesRaw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  const usernameLines = usernameLinesRaw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  // Validate format combo
  const invalids = validateComboFormat(comboLines);
  if (invalids.length > 0) {
    alert(`Invalid format at line(s): ${invalids.join(', ')}. Each line must be user:pass:cookie`);
    return;
  }

  if (usernameLines.some(u => u.length < 3)) {
    alert('Usernames must have at least 3 characters each.');
    return;
  }
  if (usernameLines.length > comboLines.length) {
    alert('Number of usernames must not be greater than number of combo lines.');
    return;
  }

  const selectedCombo = [];
  const remainingCombo = [];

  comboLines.forEach(combo => {
    const username = combo.split(':')[0];
    if (usernameLines.includes(username)) {
      selectedCombo.push(combo);
    } else {
      remainingCombo.push(combo);
    }
  });

  document.getElementById('output-selected-combo').innerText = selectedCombo.join('\n');
  document.getElementById('output-remaining-combo').innerText = remainingCombo.join('\n');
  document.getElementById('count-label-selected').innerText = `Total Selected: ${selectedCombo.length} accounts`;
  document.getElementById('count-label-remaining').innerText = `Total Remaining: ${remainingCombo.length} accounts`;
}

function clearText() {
  userPassInput.value = '';
  cookieInput.value = '';
  document.getElementById('output-selected-combo').innerText = '';
  document.getElementById('output-remaining-combo').innerText = '';
  document.getElementById('count-label-selected').innerText = 'Total Selected: 0 accounts';
  document.getElementById('count-label-remaining').innerText = 'Total Remaining: 0 accounts';
}

function copyToClipboard(target) {
  let textToCopy = '';
  if (target === 'selected') {
    textToCopy = document.getElementById('output-selected-combo').innerText;
  } else if (target === 'remaining') {
    textToCopy = document.getElementById('output-remaining-combo').innerText;
  }

  if (!textToCopy.trim()) {
    alert('No data to copy!');
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    alert(`Copied ${target} combo to clipboard!`);
  }).catch(err => {
    alert('Failed to copy to clipboard!');
    console.error(err);
  });
}
