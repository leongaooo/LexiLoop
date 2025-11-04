import { useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import DisplayView from './components/DisplayView'
import SettingsView from './components/SettingsView'
import AddCorpusModal from './components/AddCorpusModal'
import Toolbar from './components/Toolbar'
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
    settings
  } = useAppStore()

  // 自动轮播逻辑
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
          if (!showSettings && !showAddModal) {
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
  }, [showSettings, showAddModal, togglePlay, nextCorpus, prevCorpus, setShowSettings])

  return (
    <div
      className="app"
      style={{ backgroundColor: showSettings ? '#fafafa' : settings.backgroundColor }}
    >
      <Toolbar />
      {showSettings ? (
        <SettingsView />
      ) : (
        <DisplayView />
      )}
      {showAddModal && <AddCorpusModal />}
    </div>
  )
}

export default App
