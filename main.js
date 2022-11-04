const { app, BrowserWindow ,ipcMain} = require('electron');
const path = require('path');
const { getPrice} = require('./scrapData');

function createWindow () {
    const win = new BrowserWindow({
        width: 1256,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration:true,
            contextIsolation:false
        }
    })
    win.loadFile('./front/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
ipcMain.handle('request-get-prices',async (event, arg) => getPrice(arg));