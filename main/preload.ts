import { contextBridge, ipcRenderer } from 'electron'

// 暴露受保护的方法给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
    // 窗口控制方法
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),
    isMaximized: () => ipcRenderer.invoke('window-is-maximized'),
    onMaximize: (callback: (isMaximized: boolean) => void) => {
        ipcRenderer.on('window-maximize-changed', (_event, isMaximized: boolean) => {
            callback(isMaximized)
        })
    },
})
