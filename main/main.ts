import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 200,
        minHeight: 40, // 只保留标题栏高度，允许尽可能小
        frame: false, // 无边框窗口，使用自定义标题栏
        webPreferences: {
            preload: join(__dirname, './preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    })

    // 移除菜单栏
    Menu.setApplicationMenu(null)

    // 注册 IPC 处理程序
    ipcMain.handle('window-minimize', () => {
        mainWindow?.minimize()
    })

    ipcMain.handle('window-maximize', () => {
        if (mainWindow?.isMaximized()) {
            mainWindow.unmaximize()
        } else {
            mainWindow?.maximize()
        }
    })

    ipcMain.handle('window-close', () => {
        mainWindow?.close()
    })

    ipcMain.handle('window-is-maximized', () => {
        return mainWindow?.isMaximized() ?? false
    })

    // 监听窗口最大化状态变化
    mainWindow.on('maximize', () => {
        mainWindow?.webContents.send('window-maximize-changed', true)
    })

    mainWindow.on('unmaximize', () => {
        mainWindow?.webContents.send('window-maximize-changed', false)
    })

    if (isDev) {
        // 开发环境：加载 Vite 开发服务器
        mainWindow.loadURL('http://localhost:5173')
        mainWindow.webContents.openDevTools()
    } else {
        // 生产环境：加载打包后的文件
        mainWindow.loadFile(join(__dirname, '../dist/index.html'))
    }

    mainWindow.on('closed', () => {
        mainWindow = null
    })
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
