const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const { PDFDocument, rgb } = require('pdf-lib');

let mainWindow;
let selectedFolderPath;
let processedFolders = [];
let isProcessing = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  ipcMain.on('select-folder', async (event) => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
    });

    if (!result.canceled) {
      const folderPath = result.filePaths[0];
      if (!processedFolders.includes(folderPath)) {
        selectedFolderPath = folderPath;
        event.reply('folder-selected', selectedFolderPath);
        mainWindow.webContents.send('reset-processing-status');
      } else {
        event.reply('folder-already-processed');
      }
    }
  });

  ipcMain.on('process-pdf', async (event) => {
    if (isProcessing) return;

    isProcessing = true;
    try {
      await appendFolderNameToPDF(selectedFolderPath);
      mainWindow.webContents.send('pdf-modification-done');
      processedFolders.push(selectedFolderPath);
    } catch (error) {
      mainWindow.webContents.send('pdf-modification-error', error.message);
    } finally {
      isProcessing = false;
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

async function appendFolderNameToPDF(folderPath) {
  const folderName = path.basename(folderPath);
  const processedFolderPath = path.join(folderPath, 'Processed');

  try {
    await fs.mkdir(processedFolderPath);
  } catch (error) {
    throw new Error(`Can't open folder! 'Processed': ${error.message}`);
  }

  const files = await fs.readdir(folderPath);
  for (const file of files) {
    if (path.extname(file) === '.pdf') {
      const filePath = path.join(folderPath, file);
      const pdfData = await fs.readFile(filePath);

      const pdfDoc = await PDFDocument.load(pdfData);
      const pages = pdfDoc.getPages();

      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      const fontSize = 12;
      const padding = fontSize;
      const textX = padding;
      const textY = height - padding;

      firstPage.drawText(folderName, {
        x: textX,
        y: textY,
        size: fontSize,
        font: await pdfDoc.embedFont('Helvetica-Bold'),
        color: rgb(1, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedFilePath = path.join(processedFolderPath, file);
      await fs.writeFile(modifiedFilePath, modifiedPdfBytes);
    }
  }
}

