import { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import DisplayView from './components/DisplayView'
import SettingsView from './components/SettingsView'
import AddCorpusModal from './components/AddCorpusModal'
import Toolbar from './components/Toolbar'
import FishModeView from './components/FishModeView'
import './styles/app.css'

function App() {
  const {
    isPlaying,
    showSettings,
    showAddModal,
    nextCorpus,
    prevCorpus,
    togglePlay,
    setShowSettings,
    settings,
    fishMode,
    theme
  } = useAppStore()

  const [windowHeight, setWindowHeight] = useState<number>(600)
  const [progressText, setProgressText] = useState<string>('')

  // 获取窗口初始大小
  useEffect(() => {
    window.electronAPI?.getSize().then((size) => {
      setWindowHeight(size.height)
    })

    // 监听窗口大小变化
    window.electronAPI?.onResize((size) => {
      setWindowHeight(size.height)
    })
  }, [])

  // 自动轮播逻辑（摸鱼模式和普通模式都支持）
  useEffect(() => {
    if (!isPlaying || showSettings || showAddModal) return

    const interval = setInterval(() => {
      nextCorpus()
    }, settings.interval * 1000)

    return () => clearInterval(interval)
  }, [isPlaying, showSettings, showAddModal, settings.interval, nextCorpus])

  // 快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果正在编辑输入框，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      switch (e.key) {
        case ' ':
          e.preventDefault()
          if (!showSettings && !showAddModal && !fishMode) {
            togglePlay()
          }
          break
        case 'Escape':
          if (showSettings) {
            setShowSettings(false)
          }
          break
        case 'ArrowRight':
          e.preventDefault()
          if (!showSettings && !showAddModal) {
            nextCorpus()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (!showSettings && !showAddModal) {
            prevCorpus()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSettings, showAddModal, fishMode, togglePlay, nextCorpus, prevCorpus, setShowSettings])

  // 根据主题获取颜色
  const getThemeColors = () => {
    if (theme === 'dark') {
      return {
        bg: '#1a1a1a',
        text: '#ffffff',
        titleBar: '#2d2d2d',
        border: '#404040'
      }
    } else {
      return {
        bg: '#ffffff',
        text: '#333333',
        titleBar: '#f5f5f5',
        border: '#e0e0e0'
      }
    }
  }

  const themeColors = getThemeColors()

  // 应用透明设置
  useEffect(() => {
    window.electronAPI?.setTransparent(settings.transparent)
  }, [settings.transparent])

  // 摸鱼模式
  if (fishMode) {
    const bgColor = settings.transparent
      ? 'transparent'
      : (theme === 'dark' ? themeColors.bg : settings.backgroundColor)

    return (
      <div
        className={`app ${theme} fish-mode`}
        style={{ backgroundColor: bgColor, margin: 0, padding: 0 }}
      >
        <FishModeView />
      </div>
    )
  }

  const bgColor = settings.transparent
    ? 'transparent'
    : (showSettings ? themeColors.bg : (theme === 'dark' ? themeColors.bg : settings.backgroundColor))

  return (
    <div
      className={`app ${theme}`}
      style={{ backgroundColor: bgColor }}
    >
      <Toolbar
        windowHeight={windowHeight}
        showProgress={true}
        progressText={progressText}
      />
      {showSettings ? (
        <SettingsView />
      ) : (
        <DisplayView
          windowHeight={windowHeight}
          onProgressReady={setProgressText}
        />
      )}
      {showAddModal && <AddCorpusModal />}
    </div>
  )
}

export default App
