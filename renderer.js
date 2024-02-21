const { ipcRenderer } = require('electron');

const selectFolderBtn = document.getElementById('select-folder-btn');
const processPdfBtn = document.getElementById('process-pdf-btn');
const modifiedFoldersList = document.getElementById('modified-folders-list');
const notification = document.getElementById('notification');

let selectedFolderPath = null;

selectFolderBtn.addEventListener('click', () => {
  ipcRenderer.send('select-folder');
  clearNotifications();
});

processPdfBtn.addEventListener('click', () => {
  if (selectedFolderPath) {
    processPdfBtn.disabled = true;
    ipcRenderer.send('process-pdf', selectedFolderPath);
    clearNotifications();
  }
});

ipcRenderer.on('folder-selected', (event, folderPath) => {
  if (selectedFolderPath === folderPath) {
    // Prevent selecting the same folder twice
    showNotification('We already did that, Željka! Pick another folder. 😄', 'blue');
    return;
  }

  selectedFolderPath = folderPath;
  const folderName = folderPath.split('/').pop();
  processPdfBtn.disabled = false;

  // Add the selected folder to the modified folders list
  const li = document.createElement('li');
  const boldFolderName = document.createElement('strong');
  boldFolderName.textContent = folderName;
  boldFolderName.style.color = 'green';
  li.appendChild(document.createTextNode('Folder: '));
  li.appendChild(boldFolderName);
  modifiedFoldersList.appendChild(li);

  showNotification(`Super, Željka! You picked: "${folderName}". You can click "Process PDFs" to modify. 😉`, 'green');
});

ipcRenderer.on('folder-already-processed', () => {
  showNotification('Already did that, Željka! Pick another folder. 😄', 'blue');
});

ipcRenderer.on('pdf-modification-done', () => {
  showNotification('Great, Željka! Modifying PDFs is finished! 🎉', 'green');
  processPdfBtn.disabled = true;
});

ipcRenderer.on('pdf-modification-error', (event, error) => {
  showNotification(`Ups, Željka! There has been an error processing PDFs: ${error}. Try again. 😕`, 'red');
  processPdfBtn.disabled = false;
});

function showNotification(message, color) {
  notification.textContent = message;
  notification.style.color = color;
}

function clearNotifications() {
  notification.textContent = '';
  notification.style.color = '';
}
