require('dotenv').config();
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
let electronExecute = '';

if (process.platform === 'win32') {
	electronExecute = 'electron.cmd';
} else {
	electronExecute = 'electron';
}
require('electron-reload')(__dirname, { electron: path.join(__dirname, 'node_modules', '.bin', electronExecute) });	

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ width: 800, height: 600 });
	mainWindow.loadURL('http://' + process.env.HOST + ':' + process.env.PORT);
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
