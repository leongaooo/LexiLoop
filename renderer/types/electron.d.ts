export interface ElectronAPI {
    platform: string
    minimize: () => Promise<void>
    maximize: () => Promise<void>
    close: () => Promise<void>
    isMaximized: () => Promise<boolean>
    onMaximize: (callback: (isMaximized: boolean) => void) => void
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI
    }
}
