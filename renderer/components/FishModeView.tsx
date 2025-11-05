import { useAppStore } from '../store/useAppStore'
import './FishModeView.css'

export default function FishModeView() {
  const { corpusList, currentIndex, settings, setFishMode, theme } = useAppStore()

  const currentCorpus = corpusList[currentIndex]

  const handleRestore = () => {
    setFishMode(false)
    // 恢复默认窗口大小
    if (window.electronAPI && 'setSize' in window.electronAPI) {
      (window.electronAPI as any).setSize(1000, 600)
    }
  }

  if (corpusList.length === 0) {
    return (
      <div className="fish-mode-view">
        <div className="fish-drag-handle" title="拖动窗口">
          🤚
        </div>
        <button className="fish-restore-btn" onClick={handleRestore} title="还原正常模式">
          ←
        </button>
        <div className="fish-empty-message">暂无语料</div>
      </div>
    )
  }

  return (
    <div className="fish-mode-view">
      <div className="fish-drag-handle" title="拖动窗口">
        🤚
      </div>
      <button className="fish-restore-btn" onClick={handleRestore} title="还原正常模式">
        ←
      </button>
      <div className="fish-content">
        <div
          key={currentIndex}
          className="fish-corpus-text"
          style={{
            fontSize: `${settings.fontSize}px`,
            color: settings.fontColor,
            lineHeight: settings.lineHeight,
            fontWeight: settings.fontWeight,
          }}
        >
          {currentCorpus?.text || ''}
        </div>
      </div>
    </div>
  )
}
