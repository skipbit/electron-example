const { app, BrowserWindow, screen } = require('electron/main')
const path = require('node:path')

const createWindow = () => {
    const primaryDisplay = screen.getPrimaryDisplay()
    const win = new BrowserWindow({
        width: primaryDisplay.size.width,
        height: primaryDisplay.size.height,
        frame: false,
        // kiosk: true,
        webPreferences: {
          preload: path.join(__dirname, 'preload.js')
        }
    })
    win.loadFile('index.html')
    win.webContents.on('crashed', () => {
        createWindow()
    });
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
