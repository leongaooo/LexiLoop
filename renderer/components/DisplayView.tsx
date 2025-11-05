import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import './DisplayView.css'

interface DisplayViewProps {
  windowHeight?: number
  onProgressReady?: (progress: string) => void
}

export default function DisplayView({ windowHeight, onProgressReady }: DisplayViewProps) {
  const { corpusList, currentIndex, settings, theme } = useAppStore()

  const currentCorpus = corpusList[currentIndex]
  const total = corpusList.length
  const progress = total > 0 ? `${currentIndex + 1} / ${total}` : '0 / 0'

  // 通知父组件进度信息
  useEffect(() => {
    if (onProgressReady) {
      onProgressReady(progress)
    }
  }, [progress, onProgressReady])

  // 当高度小于200时，不显示底部进度
  const shouldShowBottomProgress = windowHeight === undefined || windowHeight >= 200

  if (corpusList.length === 0) {
    return (
      <div className="display-view empty">
        <div className="empty-message">
          <p>暂无语料</p>
          <p className="hint">点击上方 "➕ 添加语料" 按钮开始添加</p>
        </div>
      </div>
    )
  }

  return (
    <div className="display-view">
      <div className="corpus-container">
        <div
          key={currentIndex} // 使用 key 触发重新渲染和动画
          className="corpus-text"
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
      {shouldShowBottomProgress && (
        <div className="progress-indicator">{progress}</div>
      )}
    </div>
  )
}
