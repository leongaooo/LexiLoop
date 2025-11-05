import { contextBridge, ipcRenderer } from 'electron'

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    // 窗口控制方法
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    setSize: (width: number, height: number) => ipcRenderer.invoke('window-set-size', width, height),
    setAlwaysOnTop: (flag: boolean) => ipcRenderer.invoke('window-set-always-on-top', flag),
    getSize: () => ipcRenderer.invoke('window-get-size'),
    center: () => ipcRenderer.invoke('window-center'),
    setTransparent: (transparent: boolean) => ipcRenderer.invoke('window-set-transparent', transparent),
    onMaximize: (callback: (isMaximized: boolean) => void) => {
        ipcRenderer.on('window-maximize-changed', (_event, isMaximized: boolean) => {
            callback(isMaximized)
        })
    },
    onResize: (callback: (size: { width: number; height: number }) => void) => {
        ipcRenderer.on('window-resize', (_event, size: { width: number; height: number }) => {
            callback(size)
        })
    },
})
