import { useAppStore } from '../store/useAppStore'
import './DisplayView.css'

export default function DisplayView() {
  const { corpusList, currentIndex, settings } = useAppStore()

  const currentCorpus = corpusList[currentIndex]
  const total = corpusList.length
  const progress = total > 0 ? `${currentIndex + 1} / ${total}` : '0 / 0'

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
          }}
        >
          {currentCorpus?.text || ''}
        </div>
      </div>
      <div className="progress-indicator">{progress}</div>
    </div>
  )
}
