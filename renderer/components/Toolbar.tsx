import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import './Toolbar.css'

declare global {
  interface Window {
    electronAPI?: {
      minimize: () => Promise<void>
      maximize: () => Promise<void>
      close: () => Promise<void>
      isMaximized: () => Promise<boolean>
      onMaximize: (callback: (isMaximized: boolean) => void) => void
    }
  }
}

export default function Toolbar() {
  const { setShowSettings, setShowAddModal, togglePlay, isPlaying } = useAppStore()
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // 检查初始最大化状态
    window.electronAPI?.isMaximized().then(setIsMaximized)

    // 监听最大化状态变化
    window.electronAPI?.onMaximize(setIsMaximized)
  }, [])

  const handleMinimize = () => {
    window.electronAPI?.minimize()
  }

  const handleMaximize = () => {
    window.electronAPI?.maximize()
  }

  const handleClose = () => {
    window.electronAPI?.close()
  }

  return (
    <div className="title-bar">
      <div className="title-bar-left">
        <div className="title-bar-title">LexiLoop</div>
        <div className="title-bar-buttons">
          <button
            className="title-bar-btn"
            onClick={togglePlay}
            title={isPlaying ? "暂停" : "继续"}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="title-bar-btn" onClick={() => setShowSettings(true)} title="设置">
            ⚙️
          </button>
          <button className="title-bar-btn" onClick={() => setShowAddModal(true)} title="添加语料">
            ➕
          </button>
        </div>
      </div>
      <div className="title-bar-right">
        <button className="title-bar-control minimize" onClick={handleMinimize} title="最小化">
          <span>−</span>
        </button>
        <button className="title-bar-control maximize" onClick={handleMaximize} title={isMaximized ? "还原" : "最大化"}>
          <span>{isMaximized ? '❐' : '□'}</span>
        </button>
        <button className="title-bar-control close" onClick={handleClose} title="关闭">
          <span>×</span>
        </button>
      </div>
    </div>
  )
}
