export interface ElectronAPI {
    platform: string
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
    setSize: (width: number, height: number) => Promise<void>
    setAlwaysOnTop: (flag: boolean) => Promise<void>
    getSize: () => Promise<{ width: number; height: number }>
    center: () => Promise<void>
    setTransparent: (transparent: boolean) => Promise<void>
    onMaximize: (callback: (isMaximized: boolean) => void) => void
    onResize: (callback: (size: { width: number; height: number }) => void) => void
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI
    }
}
