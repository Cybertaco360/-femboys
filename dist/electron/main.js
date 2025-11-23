"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const server_1 = require("../server");
let mainWindow = null;
function createWindow(port) {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        }
    });
    const isDev = process.env.ELECTRON_DEV === '1';
    const url = isDev
        ? 'http://localhost:5173'
        : `file://${path_1.default.join(__dirname, '../renderer/index.html')}`;
    mainWindow.loadURL(url);
    mainWindow.on('closed', () => { mainWindow = null; });
}
electron_1.app.whenReady().then(() => {
    const port = (0, server_1.startServer)();
    createWindow(port);
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow(port);
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
