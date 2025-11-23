const { app, BrowserWindow } = require('electron');
const path = require('path');

// Start express backend inside Electron main process
require('./server'); // this will start the server on PORT env or 3000

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // Load local server so fetch('/api/chat') works unchanged.
  const port = process.env.PORT || 3000;
  win.loadURL(`http://localhost:${port}/index.html`);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
