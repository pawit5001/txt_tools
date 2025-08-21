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
      userPassInput.value = allText.trim();
    }
  }
});

// รองรับ drag & drop ไฟล์เข้า textarea
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
      userPassInput.value = allText.trim();
    }
  }
});

// -----------
// เอา paste handler ออกเลย เพื่อใช้ behavior ปกติของ browser
// -----------

// ฟังก์ชัน parse combo (username:password:cookie)
function parseCombo(line) {
  const parts = line.split(':');
  if (parts.length < 3) {
    throw new Error("Invalid combo format, must be username:password:cookie");
  }
  const username = parts[0].trim();
  const password = parts[1].trim();
  const cookie = parts.slice(2).join(':').trim(); // รวมที่เหลือเป็น cookie
  return { username, password, cookie };
}

// ฟังก์ชันตรวจสอบ format combo
function validateComboFormat(lines) {
  const invalidLines = [];
  lines.forEach((line, i) => {
    try {
      const { username, password, cookie } = parseCombo(line);
      if (!username || !password || !cookie) {
        invalidLines.push(i + 1);
      }
    } catch (e) {
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
    alert('Please enter combo data.');
    return;
  }
  if (!usernameLinesRaw) {
    alert('Please enter username(s).');
    return;
  }

  const comboLines = comboLinesRaw.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

  // Username อาจมีหลาย format → ดึงเฉพาะส่วนแรกก่อน ":" มาใช้เทียบ
  const usernameLines = usernameLinesRaw.split(/\r?\n/)
    .map(l => l.trim().split(':')[0].toLowerCase())
    .filter(l => l.length > 0);

  // Validate combo format
  const invalids = validateComboFormat(comboLines);
  if (invalids.length > 0) {
    alert(`Invalid format at line(s): ${invalids.join(', ')}. Each combo must be username:password:cookie`);
    return;
  }

  const selectedCombo = [];
  const remainingCombo = [];

  comboLines.forEach(combo => {
    const { username } = parseCombo(combo);
    if (usernameLines.includes(username.toLowerCase())) {
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

// ฟังก์ชัน clear
function clearText() {
  userPassInput.value = '';
  cookieInput.value = '';
  document.getElementById('output-selected-combo').innerText = '';
  document.getElementById('output-remaining-combo').innerText = '';
  document.getElementById('count-label-selected').innerText = 'Total Selected: 0 accounts';
  document.getElementById('count-label-remaining').innerText = 'Total Remaining: 0 accounts';
}

// copy to clipboard
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
