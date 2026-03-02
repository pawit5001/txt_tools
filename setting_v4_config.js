// Default helper list
const DEFAULT_HELPERS = [
  "MBKai_51756",
  "MBKai_97661",
  "Ch1llotterdudeRBX41",
  "L4dyFuzzyzhaarkTV23",
  "zkkyg4mes",
  "SSag3lunaTV",
  "BlazeZen3297",
  "NebulaDrift4786",
  "FlashShard5540",
  "ayrkzpab9440",
  "hsjbkptt7439",
  "gjmfqdpf8832",
  "nyqhazrj1954",
  "qwqp74clft50",
  "LegacyTurbo4831",
  "Specter4839",
  "ayrkzpab9440",
  "hsjbkptt7439",
  "iejw42mcll45"
];

// Store lists
let farmList = [];
let helperList = [];

// Validate Roblox username format
function isValidRobloxUsername(username) {
  // Roblox username rules:
  // - 3-20 characters
  // - Can contain letters, numbers, underscores, and hyphens only
  // - Cannot start with a number
  // - Cannot contain spaces or other special characters
  
  if (!username || username.length === 0) {
    return { valid: false, message: 'Username cannot be empty' };
  }
  
  // Trim and clean the username
  const cleanUsername = username.trim();
  
  if (cleanUsername.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters' };
  }
  
  if (cleanUsername.length > 20) {
    return { valid: false, message: 'Username must be 20 characters or less' };
  }
  
  // Check for spaces
  if (cleanUsername.includes(' ')) {
    return { 
      valid: false, 
      message: 'Username cannot contain spaces' 
    };
  }
  
  // Check if starts with letter or underscore only
  if (!/^[a-zA-Z_]/.test(cleanUsername)) {
    return { 
      valid: false, 
      message: 'Username must start with a letter or underscore' 
    };
  }
  
  // Check for invalid characters - only allow letters, numbers, underscores, hyphens
  if (!/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(cleanUsername)) {
    return { 
      valid: false, 
      message: 'Username can only contain letters, numbers, underscores, and hyphens' 
    };
  }
  
  // Check for dangerous strings that shouldn't be in usernames
  const dangerousStrings = ['script_key', '_G.', 'loadstring', 'HttpGet', 'Settings_V4', '=', '{', '}', '[', ']', '(', ')', '"', "'", ':', ';'];
  for (let dangerous of dangerousStrings) {
    if (cleanUsername.includes(dangerous)) {
      return { 
        valid: false, 
        message: `Username contains invalid content: "${dangerous}"` 
      };
    }
  }
  
  return { valid: true, message: '' };
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  helperList = [...DEFAULT_HELPERS];
  renderHelperList();
  
  // Allow Enter key to add items
  document.getElementById('farm-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addFarmItem();
    }
  });
  
  document.getElementById('helper-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addHelperItem();
    }
  });
});

// Add farm item
function addFarmItem() {
  const input = document.getElementById('farm-input');
  const value = input.value.trim();
  
  if (!value) {
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please enter a farm username'
    });
    return;
  }
  
  // Handle multiple lines and spaces as separators
  const lines = value.split(/[\n\r\s]+/).filter(line => line.length > 0);
  let addedCount = 0;
  let errors = [];
  
  lines.forEach(username => {
    // Validate username format
    const validation = isValidRobloxUsername(username);
    
    if (!validation.valid) {
      errors.push(`"${username}": ${validation.message}`);
    } else if (farmList.includes(username)) {
      errors.push(`"${username}" is already added`);
    } else {
      farmList.push(username);
      addedCount++;
    }
  });
  
  input.value = '';
  renderFarmList();
  
  if (errors.length > 0) {
    const MAX_ERRORS = 5;
    const displayErrors = errors.slice(0, MAX_ERRORS);
    const remainingErrors = errors.length - MAX_ERRORS;
    const errorMessage = displayErrors.join('\n') + 
                         (remainingErrors > 0 ? `\n\n... and ${remainingErrors} more errors` : '');
    showModal({
      type: 'error',
      title: 'Validation Errors',
      message: 'Errors:\n' + errorMessage
    });
  }
  
  if (addedCount > 0) {
    showModal({
      type: 'success',
      title: 'Success',
      message: `Added ${addedCount} farm(s)`
    });
  }
}

// Remove farm item
function removeFarmItem(index) {
  farmList.splice(index, 1);
  renderFarmList();
}

// Delete all farms
function deleteAllFarms() {
  if (farmList.length === 0) {
    showModal({
      type: 'info',
      title: 'No Data',
      message: 'No farms to delete'
    });
    return;
  }
  
  showModal({
    type: 'confirm',
    title: 'Confirm Delete',
    message: `Delete all ${farmList.length} farms?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      farmList = [];
      renderFarmList();
    }
  });
}

// Render farm list
function renderFarmList() {
  const container = document.getElementById('farm-list');
  const count = document.getElementById('farm-count');
  
  container.innerHTML = farmList.map((farm, index) => `
    <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
      <span class="text-gray-900 font-mono text-sm">${farm}</span>
      <button onclick="removeFarmItem(${index})"
        class="text-red-500 hover:text-red-700 font-semibold text-sm transition">
        Remove
      </button>
    </div>
  `).join('');
  
  count.innerText = `${farmList.length} ${farmList.length === 1 ? 'farm' : 'farms'}`;
}

// Add helper item
function addHelperItem() {
  const input = document.getElementById('helper-input');
  const value = input.value.trim();
  
  if (!value) {
    showModal({
      type: 'warning',
      title: 'Input Required',
      message: 'Please enter a helper username'
    });
    return;
  }
  
  // Handle multiple lines and spaces as separators
  const lines = value.split(/[\n\r\s]+/).filter(line => line.length > 0);
  let addedCount = 0;
  let errors = [];
  
  lines.forEach(username => {
    // Validate username format
    const validation = isValidRobloxUsername(username);
    
    if (!validation.valid) {
      errors.push(`"${username}": ${validation.message}`);
    } else if (helperList.includes(username)) {
      errors.push(`"${username}" is already added`);
    } else {
      helperList.push(username);
      addedCount++;
    }
  });
  
  input.value = '';
  renderHelperList();
  
  if (errors.length > 0) {
    const MAX_ERRORS = 5;
    const displayErrors = errors.slice(0, MAX_ERRORS);
    const remainingErrors = errors.length - MAX_ERRORS;
    const errorMessage = displayErrors.join('\n') + 
                         (remainingErrors > 0 ? `\n\n... and ${remainingErrors} more errors` : '');
    showModal({
      type: 'error',
      title: 'Validation Errors',
      message: 'Errors:\n' + errorMessage
    });
  }
  
  if (addedCount > 0) {
    showModal({
      type: 'success',
      title: 'Success',
      message: `Added ${addedCount} helper(s)`
    });
  }
}

// Remove helper item
function removeHelperItem(index) {
  helperList.splice(index, 1);
  renderHelperList();
}

// Delete all helpers
function deleteAllHelpers() {
  if (helperList.length === 0) {
    showModal({
      type: 'info',
      title: 'No Data',
      message: 'No helpers to delete'
    });
    return;
  }
  
  showModal({
    type: 'confirm',
    title: 'Confirm Delete',
    message: `Delete all ${helperList.length} helpers?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      helperList = [];
      renderHelperList();
    }
  });
}

// Use default helpers
function useDefaultHelpers() {
  helperList = [...DEFAULT_HELPERS];
  renderHelperList();
  showModal({
    type: 'success',
    title: 'Success',
    message: 'Default helper list loaded'
  });
}

// Render helper list
function renderHelperList() {
  const container = document.getElementById('helper-list');
  const count = document.getElementById('helper-count');
  
  container.innerHTML = helperList.map((helper, index) => `
    <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
      <span class="text-gray-900 font-mono text-sm">${helper}</span>
      <button onclick="removeHelperItem(${index})"
        class="text-red-500 hover:text-red-700 font-semibold text-sm transition">
        Remove
      </button>
    </div>
  `).join('');
  
  count.innerText = `${helperList.length} ${helperList.length === 1 ? 'helper' : 'helpers'}`;
}

// Validate script key format
function isValidScriptKey(key) {
  // Script key should be alphanumeric only, 32 characters typically
  const scriptKeyRegex = /^[a-zA-Z0-9]{32}$/;
  
  if (!key || key.length === 0) {
    return { valid: false, message: 'Script Key cannot be empty' };
  }
  
  if (key.length !== 32) {
    return { valid: false, message: 'Script Key must be exactly 32 characters' };
  }
  
  if (!scriptKeyRegex.test(key)) {
    return { 
      valid: false, 
      message: 'Script Key must contain only letters and numbers (A-Z, a-z, 0-9)' 
    };
  }
  
  return { valid: true, message: '' };
}

// Generate script
function generateScript() {
  const scriptKey = document.getElementById('script-key-input').value.trim();
  const output = document.getElementById('output-text');
  
  // Validate script key format
  const keyValidation = isValidScriptKey(scriptKey);
  if (!keyValidation.valid) {
    showModal({
      type: 'error',
      title: 'Invalid Script Key',
      message: `${keyValidation.message}\n\nExample: aYupqkQjEuKFXNNUVLJaYtCFMXemdDrP`
    });
    return;
  }
  
  if (farmList.length === 0) {
    showModal({
      type: 'warning',
      title: 'Missing Data',
      message: 'Please add at least one V4 Farm username'
    });
    return;
  }
  
  if (helperList.length === 0) {
    showModal({
      type: 'warning',
      title: 'Missing Data',
      message: 'Please add at least one Helper username'
    });
    return;
  }
  
  // Build helper list string
  const helperListStr = helperList.map((h, i) => `"${h}"${i < helperList.length - 1 ? ',' : ''}`).join('\n        ');
  
  // Build farm list string
  const farmListStr = farmList.map((f, i) => `"${f}"${i < farmList.length - 1 ? ',' : ''}`).join('\n        ');
  
  // Generate script
  const script = `_G.Settings_V4 = {
    ["LockTiers"] = 11,
    ["Lever"] = true,
    ["InVIPServ"] = true,

    ["HelperNameList"] = {
        ${helperListStr}
    },

    ["V4FarmList"] = {
        ${farmListStr}
    }
}

script_key = "${scriptKey}";
loadstring(game:HttpGet("https://raw.githubusercontent.com/xshiba/MasterPClient/refs/heads/main/Loader.lua"))()

task.spawn(function()
    task.wait(20)
    if not game.CoreGui:FindFirstChild("MaruGui") then
        game:GetService("TeleportService"):Teleport(
            game.PlaceId,
            game:GetService("Players").LocalPlayer
        )
    end
end)`;
  
  output.innerText = script;
}

// Copy to clipboard
function copyToClipboard() {
  const output = document.getElementById('output-text').innerText;
  
  if (!output) {
    showToast({
      type: 'warning',
      message: 'No script to copy.'
    });
    return;
  }
  
  navigator.clipboard.writeText(output).then(() => {
    showToast({
      type: 'success',
      message: 'Script copied.'
    });
  }).catch(() => {
    showToast({
      type: 'error',
      message: 'Copy failed. Try again.'
    });
  });
}

// Clear all
function clearAll() {
  const scriptKey = document.getElementById('script-key-input').value.trim();
  const hasFarms = farmList.length > 0;
  const hasHelpers = helperList.length > 0;
  const hasOutput = document.getElementById('output-text').innerText.trim().length > 0;
  
  // Check if there's any data to clear
  if (!scriptKey && !hasFarms && helperList.length === DEFAULT_HELPERS.length && !hasOutput) {
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
    message: 'Are you sure you want to clear everything?',
    confirmText: 'Clear All',
    cancelText: 'Cancel',
    onConfirm: () => {
      document.getElementById('script-key-input').value = '';
      farmList = [];
      helperList = [...DEFAULT_HELPERS];
      document.getElementById('farm-input').value = '';
      document.getElementById('helper-input').value = '';
      document.getElementById('output-text').innerText = '';
      
      renderFarmList();
      renderHelperList();
      
      showModal({
        type: 'success',
        title: 'Cleared',
        message: 'All data cleared!'
      });
    }
  });
}

// Banana mode state
let bananaUpGearList = [];
let bananaHelperList = [];

// Switch mode UI
function switchMode(mode) {
  const maruSection = document.getElementById('maru-section');
  const bananaSection = document.getElementById('banana-section');
  document.getElementById('mode-maru').classList.remove('ring-4', 'ring-yellow-400');
  document.getElementById('mode-banana').classList.remove('ring-4', 'ring-blue-600');
  if (mode === 'banana') {
    maruSection.style.display = 'none';
    bananaSection.style.display = '';
    document.getElementById('mode-banana').classList.add('ring-4', 'ring-yellow-400');
    // sync default helper from Maru every time Banana mode is opened
    if (bananaHelperList.length === 0) {
      bananaHelperList = [...helperList];
      renderBananaHelperList();
    }
  } else {
    maruSection.style.display = '';
    bananaSection.style.display = 'none';
    document.getElementById('mode-maru').classList.add('ring-4', 'ring-blue-600');
  }
}

// Banana Up Gear
function addBananaUpGearItem() {
  const input = document.getElementById('banana-upgear-input');
  const value = input.value.trim();
  if (!value) {
    showModal({ type: 'warning', title: 'Input Required', message: 'Please enter a farm username' });
    return;
  }
  const lines = value.split(/[\n\r\s]+/).filter(line => line.length > 0);
  let addedCount = 0;
  let errors = [];
  lines.forEach(username => {
    const validation = isValidRobloxUsername(username);
    if (!validation.valid) {
      errors.push(`"${username}": ${validation.message}`);
    } else if (bananaUpGearList.includes(username)) {
      errors.push(`"${username}" is already added`);
    } else {
      bananaUpGearList.push(username);
      addedCount++;
    }
  });
  input.value = '';
  renderBananaUpGearList();
  if (errors.length > 0) {
    const MAX_ERRORS = 5;
    const displayErrors = errors.slice(0, MAX_ERRORS);
    const remainingErrors = errors.length - MAX_ERRORS;
    const errorMessage = displayErrors.join('\n') + (remainingErrors > 0 ? `\n\n... and ${remainingErrors} more errors` : '');
    showModal({ type: 'error', title: 'Validation Errors', message: 'Errors:\n' + errorMessage });
  }
  if (addedCount > 0) {
    showModal({ type: 'success', title: 'Success', message: `Added ${addedCount} account(s)` });
  }
}

function removeBananaUpGearItem(index) {
  bananaUpGearList.splice(index, 1);
  renderBananaUpGearList();
}

function deleteAllBananaUpGear() {
  if (bananaUpGearList.length === 0) {
    showModal({ type: 'info', title: 'No Data', message: 'No accounts to delete' });
    return;
  }
  showModal({
    type: 'confirm',
    title: 'Confirm Delete',
    message: `Delete all ${bananaUpGearList.length} accounts?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      bananaUpGearList = [];
      renderBananaUpGearList();
    }
  });
}

function renderBananaUpGearList() {
  const container = document.getElementById('banana-upgear-list');
  const count = document.getElementById('banana-upgear-count');
  container.innerHTML = bananaUpGearList.map((farm, index) => `
    <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
      <span class="text-gray-900 font-mono text-sm">${farm}</span>
      <button onclick="removeBananaUpGearItem(${index})"
        class="text-red-500 hover:text-red-700 font-semibold text-sm transition">Remove</button>
    </div>
  `).join('');
  count.innerText = `${bananaUpGearList.length} ${bananaUpGearList.length === 1 ? 'account' : 'accounts'}`;
}

// Banana Helper
function addBananaHelperItem() {
  const input = document.getElementById('banana-helper-input');
  const value = input.value.trim();
  if (!value) {
    showModal({ type: 'warning', title: 'Input Required', message: 'Please enter a helper username' });
    return;
  }
  const lines = value.split(/[\n\r\s]+/).filter(line => line.length > 0);
  let addedCount = 0;
  let errors = [];
  lines.forEach(username => {
    const validation = isValidRobloxUsername(username);
    if (!validation.valid) {
      errors.push(`"${username}": ${validation.message}`);
    } else if (bananaHelperList.includes(username)) {
      errors.push(`"${username}" is already added`);
    } else {
      bananaHelperList.push(username);
      addedCount++;
    }
  });
  input.value = '';
  renderBananaHelperList();
  if (errors.length > 0) {
    const MAX_ERRORS = 5;
    const displayErrors = errors.slice(0, MAX_ERRORS);
    const remainingErrors = errors.length - MAX_ERRORS;
    const errorMessage = displayErrors.join('\n') + (remainingErrors > 0 ? `\n\n... and ${remainingErrors} more errors` : '');
    showModal({ type: 'error', title: 'Validation Errors', message: 'Errors:\n' + errorMessage });
  }
  if (addedCount > 0) {
    showModal({ type: 'success', title: 'Success', message: `Added ${addedCount} helper(s)` });
  }
}

function removeBananaHelperItem(index) {
  bananaHelperList.splice(index, 1);
  renderBananaHelperList();
}

function deleteAllBananaHelpers() {
  if (bananaHelperList.length === 0) {
    showModal({ type: 'info', title: 'No Data', message: 'No helpers to delete' });
    return;
  }
  showModal({
    type: 'confirm',
    title: 'Confirm Delete',
    message: `Delete all ${bananaHelperList.length} helpers?`,
    confirmText: 'Delete',
    cancelText: 'Cancel',
    onConfirm: () => {
      bananaHelperList = [];
      renderBananaHelperList();
    }
  });
}

function useDefaultBananaHelpers() {
  // ใช้ helperList ของ Maru เป็น default
  bananaHelperList = [...helperList];
  renderBananaHelperList();
  showModal({ type: 'success', title: 'Success', message: 'Default helper list loaded (from Maru)' });
}

function renderBananaHelperList() {
  const container = document.getElementById('banana-helper-list');
  const count = document.getElementById('banana-helper-count');
  container.innerHTML = bananaHelperList.map((helper, index) => `
    <div class="flex items-center justify-between bg-white border border-gray-200 rounded p-3">
      <span class="text-gray-900 font-mono text-sm">${helper}</span>
      <button onclick="removeBananaHelperItem(${index})"
        class="text-red-500 hover:text-red-700 font-semibold text-sm transition">Remove</button>
    </div>
  `).join('');
  count.innerText = `${bananaHelperList.length} ${bananaHelperList.length === 1 ? 'helper' : 'helpers'}`;
}

// Banana script key validation (allow shorter)
function isValidBananaKey(key) {
  if (!key || key.length === 0) {
    return { valid: false, message: 'Key cannot be empty' };
  }
  // Accept any non-empty string for now
  return { valid: true, message: '' };
}

// Generate Banana script
function generateBananaScript() {
  const key = document.getElementById('banana-key-input').value.trim();
  const output = document.getElementById('output-text');
  const keyValidation = isValidBananaKey(key);
  if (!keyValidation.valid) {
    showModal({ type: 'error', title: 'Invalid Key', message: keyValidation.message });
    return;
  }
  if (bananaUpGearList.length === 0) {
    showModal({ type: 'warning', title: 'Missing Data', message: 'Please add at least one Account Up Gear username' });
    return;
  }
  // Use default helpers if none
  if (bananaHelperList.length === 0) {
    useDefaultBananaHelpers();
  }
  // Build helper list string
  const helperListStr = bananaHelperList.map((h, i) => `"${h}"${i < bananaHelperList.length - 1 ? ',' : ''}`).join('\n      ');
  // Build up gear list string
  const upGearListStr = bananaUpGearList.map((f, i) => `"${f}"${i < bananaUpGearList.length - 1 ? ',' : ''}`).join('\n      ');
  // Generate script
  const script = `getgenv().ConfigV4 = {
    ["Account Up Gear"] = {
      ${upGearListStr}
    },
    ["Account Help"] = {
      ${helperListStr}
    },
    ["Method Kick"] = {
        ["End Moon"] = true,
    },
    ["Auto Join"] = false,
    ["Auto Change Race"] = {
        ["Enabled"] = false,
        ["Race"] = {"Skypiea"} --- Human,Skypiea,Fishman,Mink
    },
    ["Webhook"] = {
        ["url"] = "",
        ["Done Train"] = false,
        ["Done Trial"] = false,
    }
}
getgenv().Key = "${key}"
loadstring(game:HttpGet("https://raw.githubusercontent.com/obiiyeuem/vthangsitink/refs/heads/main/NewV4Config.lua"))()`;
  output.innerText = script;
}

function copyBananaToClipboard() {
  const output = document.getElementById('output-text').innerText;
  if (!output) {
    showToast({ type: 'warning', message: 'No script to copy.' });
    return;
  }
  navigator.clipboard.writeText(output).then(() => {
    showToast({ type: 'success', message: 'Script copied.' });
  }).catch(() => {
    showToast({ type: 'error', message: 'Copy failed. Try again.' });
  });
}

function clearBananaAll() {
  const key = document.getElementById('banana-key-input').value.trim();
  const hasUpGear = bananaUpGearList.length > 0;
  const hasHelpers = bananaHelperList.length > 0;
  const hasOutput = document.getElementById('output-text').innerText.trim().length > 0;
  if (!key && !hasUpGear && bananaHelperList.length === DEFAULT_HELPERS.length && !hasOutput) {
    showModal({ type: 'info', title: 'No Data', message: 'Nothing to clear. Please add some data first.' });
    return;
  }
  showModal({
    type: 'confirm',
    title: 'Confirm Clear',
    message: 'Are you sure you want to clear everything?',
    confirmText: 'Clear All',
    cancelText: 'Cancel',
    onConfirm: () => {
      document.getElementById('banana-key-input').value = '';
      bananaUpGearList = [];
      bananaHelperList = [...DEFAULT_HELPERS];
      document.getElementById('banana-upgear-input').value = '';
      document.getElementById('banana-helper-input').value = '';
      document.getElementById('output-text').innerText = '';
      renderBananaUpGearList();
      renderBananaHelperList();
      showModal({ type: 'success', title: 'Cleared', message: 'All data cleared!' });
    }
  });
}
