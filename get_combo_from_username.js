const userPassInput = document.getElementById('user-pass-input');
const fileInput = document.getElementById('file-input');
const cookieInput = document.getElementById('cookie-input');

// ฟังก์ชันนับจำนวน lines ที่ไม่ว่าง
function countLines(text) {
  if (!text.trim()) return 0;
  return text.trim().split(/\r?\n/).filter(line => line.trim().length > 0).length;
}

// อัพเดทจำนวน accounts แบบ real-time
function updateCounts() {
  const comboCount = countLines(userPassInput.value);
  const usernameCount = countLines(cookieInput.value);
  document.getElementById('combo-count').innerText = `${comboCount} accounts`;
  document.getElementById('username-count').innerText = `${usernameCount} accounts`;
}

// ฟังการเปลี่ยนแปลงใน textarea
userPassInput.addEventListener('input', updateCounts);
cookieInput.addEventListener('input', updateCounts);

// โหลดไฟล์ .txt หลายไฟล์ เข้า textarea user-pass-input
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
      // ถ้ามีข้อมูลเดิมอยู่แล้ว ให้ต่อท้าย (append) แทนการทับ
      const existingText = userPassInput.value.trim();
      if (existingText) {
        userPassInput.value = existingText + '\n' + allText.trim();
      } else {
        userPassInput.value = allText.trim();
      }
      updateCounts();
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
      // ถ้ามีข้อมูลเดิมอยู่แล้ว ให้ต่อท้าย (append) แทนการทับ
      const existingText = userPassInput.value.trim();
      if (existingText) {
        userPassInput.value = existingText + '\n' + allText.trim();
      } else {
        userPassInput.value = allText.trim();
      }
      updateCounts();
    }
  }
});

// -----------
// เอา paste handler ออกเลย เพื่อใช้ behavior ปกติของ browser
// -----------

// ฟังก์ชัน parse combo
// Old format: username:password:cookie (3 ส่วนแรก, cookie อาจมี : ข้างใน)
// New format: username:password:cookie:mail:passmail:refresh_token:client_id (หรือมากกว่า)
function parseCombo(line) {
  const parts = line.split(':');
  if (parts.length < 3) {
    throw new Error("Invalid combo format, must be at least username:password:cookie");
  }
  
  const username = parts[0].trim();
  const password = parts[1].trim();
  
  // หาตำแหน่งของ mail (ส่วนที่มี @ ซึ่งมักจะเป็นฟิลด์ที่ 4)
  let mailIndex = -1;
  for (let i = 2; i < parts.length; i++) {
    if (parts[i].includes('@')) {
      mailIndex = i;
      break;
    }
  }
  
  // cookie คือทุกอย่างจากส่วนที่ 3 จนถึงก่อน mail (ถ้ามี)
  let cookie;
  if (mailIndex > 2) {
    // มี mail → cookie จากส่วนที่ 2 ถึงก่อน mail
    cookie = parts.slice(2, mailIndex).join(':').trim();
  } else {
    // ไม่มี mail → cookie จากส่วนที่ 2 จนจบ
    cookie = parts.slice(2).join(':').trim();
  }
  
  return { username, password, cookie, fullLine: line };
}

// ฟังก์ชันตรวจสอบ format combo
function validateComboFormat(lines) {
  const invalidLines = [];
  lines.forEach((line, i) => {
    try {
      const parsed = parseCombo(line);
      if (!parsed.username || !parsed.password || !parsed.cookie) {
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
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please enter combo data.'
    });
    return;
  }
  if (!usernameLinesRaw) {
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please enter username(s).'
    });
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
    showModal({
      type: 'error',
      title: 'Invalid Format',
      message: `Invalid format at line(s): ${invalids.join(', ')}. Each combo must be at least username:password:cookie`
    });
    return;
  }

  // ตรวจสอบว่าเลือก output format แบบไหน
  const outputFormat = document.querySelector('input[name="output-format"]:checked')?.value || 'old';
  
  const selectedCombo = [];
  const remainingCombo = [];

  comboLines.forEach(combo => {
    const { username, password, cookie, fullLine } = parseCombo(combo);
    
    // Old format: แสดงเฉพาะ user:pass:cookie (3 ส่วนแรก)
    // New format: แสดงทุกอย่างครบตาม input
    const outputLine = outputFormat === 'old' 
      ? `${username}:${password}:${cookie}` 
      : fullLine;
    
    if (usernameLines.includes(username.toLowerCase())) {
      selectedCombo.push(outputLine);
    } else {
      remainingCombo.push(outputLine);
    }
  });

  document.getElementById('output-selected-combo').innerText = selectedCombo.join('\n');
  document.getElementById('output-remaining-combo').innerText = remainingCombo.join('\n');
  document.getElementById('count-label-selected').innerText = `Total Selected: ${selectedCombo.length} accounts`;
  document.getElementById('count-label-remaining').innerText = `Total Remaining: ${remainingCombo.length} accounts`;
}

// ฟังก์ชัน clear
function clearText() {
  const hasUserPass = userPassInput.value.trim().length > 0;
  const hasCookie = cookieInput.value.trim().length > 0;
  const hasOutput = document.getElementById('output-selected-combo').innerText.trim().length > 0 ||
                    document.getElementById('output-remaining-combo').innerText.trim().length > 0;
  
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
      userPassInput.value = '';
      cookieInput.value = '';
      document.getElementById('output-selected-combo').innerText = '';
      document.getElementById('output-remaining-combo').innerText = '';
      document.getElementById('count-label-selected').innerText = 'Total Selected: 0 accounts';
      document.getElementById('count-label-remaining').innerText = 'Total Remaining: 0 accounts';
      updateCounts();
    }
  });
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
    showModal({
      type: 'info',
      title: 'No Data',
      message: 'No data to copy!'
    });
    return;
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    showModal({
      type: 'success',
      title: 'Copied!',
      message: `Copied ${target} combo to clipboard!`
    });
  }).catch(err => {
    showModal({
      type: 'error',
      title: 'Copy Failed',
      message: 'Failed to copy to clipboard!'
    });
    console.error(err);
  });
}
