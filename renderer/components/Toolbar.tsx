import { useEffect, useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import './Toolbar.css'

interface ToolbarProps {
  windowHeight?: number
  showProgress?: boolean
  progressText?: string
}

export default function Toolbar({ windowHeight, showProgress, progressText }: ToolbarProps) {
  const {
    setShowSettings,
    setShowAddModal,
    togglePlay,
    isPlaying,
    setFishMode,
    fishMode,
    theme,
    toggleTheme
  } = useAppStore()
  const [isMaximized, setIsMaximized] = useState(false)
  const [isAlwaysOnTop, setIsAlwaysOnTop] = useState(false)

  useEffect(() => {
    // 检查初始最大化状态
    window.electronAPI?.isMaximized().then(setIsMaximized)

    // 监听最大化状态变化
    window.electronAPI?.onMaximize(setIsMaximized)
  }, [])

  const handleFishMode = async () => {
    // 如果窗口是全屏/最大化状态，先退出全屏
    const isMax = await window.electronAPI?.isMaximized()
    if (isMax) {
      window.electronAPI?.maximize() // 切换最大化状态（退出全屏）
      // 等待窗口状态更新
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 确保播放状态是开启的
    if (!isPlaying) {
      togglePlay()
    }

    setFishMode(true)
    // 设置窗口大小为默认摸鱼模式尺寸
    if (window.electronAPI && 'setSize' in window.electronAPI) {
      (window.electronAPI as any).setSize(500, 50)
    }
    // 摸鱼模式时默认开启窗口置顶
    if (!isAlwaysOnTop) {
      setIsAlwaysOnTop(true)
      window.electronAPI?.setAlwaysOnTop(true)
    }
  }

  const handleSetAlwaysOnTop = () => {
    const newValue = !isAlwaysOnTop
    setIsAlwaysOnTop(newValue)
    window.electronAPI?.setAlwaysOnTop(newValue)
  }

  // 如果高度小于200且有进度文本，显示进度
  const shouldShowProgress = showProgress && progressText && windowHeight !== undefined && windowHeight < 200

  // 摸鱼模式下不显示工具栏
  if (fishMode) {
    return null
  }

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
    <div className={`title-bar ${theme === 'dark' ? 'dark' : ''}`}>
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
          <button
            className="title-bar-btn"
            onClick={handleFishMode}
            title="摸鱼模式"
          >
            🐟
          </button>
          <button
            className={`title-bar-btn ${isAlwaysOnTop ? 'active' : ''}`}
            onClick={handleSetAlwaysOnTop}
            title={isAlwaysOnTop ? "取消置顶" : "置顶窗口"}
          >
            📌
          </button>
          <button
            className="title-bar-btn"
            onClick={toggleTheme}
            title={theme === 'light' ? "切换到深色主题" : "切换到浅色主题"}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {shouldShowProgress && (
            <span className={`title-bar-progress ${windowHeight !== undefined && windowHeight < 200 ? 'compact' : ''}`}>
              {progressText}
            </span>
          )}
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
