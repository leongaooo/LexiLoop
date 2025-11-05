import { app, BrowserWindow, Menu, ipcMain } from 'electron'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

let mainWindow: BrowserWindow | null = null
let isTopMost = false

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        minWidth: 200,
        minHeight: 40, // 只保留标题栏高度，允许尽可能小
        frame: false, // 无边框窗口，使用自定义标题栏
        transparent: true, // 支持透明背景
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

    ipcMain.handle('window-set-size', (_event, width: number, height: number) => {
        if (mainWindow) {
            mainWindow.setSize(width, height)
            // 维护置顶状态
            if (isTopMost) {
                mainWindow.setAlwaysOnTop(true, 'screen-saver')
            }
        }
    })

    ipcMain.handle('window-set-always-on-top', (_event, flag: boolean) => {
        if (mainWindow) {
            isTopMost = flag
            // 使用更高优先级的 level，提升在 Windows 上的置顶稳定性
            mainWindow.setAlwaysOnTop(flag, flag ? 'screen-saver' : 'normal')
            if (flag) {
                mainWindow.show()
                mainWindow.focus()
            }
        }
    })

    ipcMain.handle('window-get-size', () => {
        if (mainWindow) {
            const size = mainWindow.getSize()
            return { width: size[0], height: size[1] }
        }
        return { width: 1000, height: 600 }
    })

    ipcMain.handle('window-center', () => {
        if (mainWindow) {
            mainWindow.center()
            if (isTopMost) {
                mainWindow.setAlwaysOnTop(true, 'screen-saver')
                mainWindow.show()
                mainWindow.focus()
            }
        }
    })

    ipcMain.handle('window-set-transparent', (_event, transparent: boolean) => {
        if (mainWindow) {
            mainWindow.setBackgroundColor(transparent ? '#00000000' : '#ffffff')
            mainWindow.setOpacity(transparent ? 0.95 : 1.0)
        }
    })

    // 监听窗口大小变化
    mainWindow.on('resize', () => {
        if (mainWindow) {
            const size = mainWindow.getSize()
            mainWindow.webContents.send('window-resize', { width: size[0], height: size[1] })
            if (isTopMost) {
                mainWindow.setAlwaysOnTop(true, 'screen-saver')
            }
        }
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
