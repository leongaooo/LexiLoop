import React from 'react'
import { useAppStore } from '../store/useAppStore'
import './SettingsView.css'

export default function SettingsView() {
  const { settings, updateSettings, setShowSettings, corpusList, deleteCorpus, updateCorpus, theme } = useAppStore()
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [editText, setEditText] = React.useState('')

  const handleEdit = (id: string, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const handleSaveEdit = (id: string) => {
    if (editText.trim()) {
      updateCorpus(id, editText.trim())
    }
    setEditingId(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  const handleExport = () => {
    if (corpusList.length === 0) {
      return
    }

    // 将语料列表转换为文本，每行一条
    const textContent = corpusList.map(item => item.text).join('\n')

    // 创建 Blob 对象
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lexiloop-corpus-${new Date().toISOString().split('T')[0]}.txt`

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 释放 URL 对象
    URL.revokeObjectURL(url)
  }

  const themeColors = theme === 'dark'
    ? { bg: '#1a1a1a', text: '#ffffff', border: '#404040', inputBg: '#2d2d2d' }
    : { bg: '#fafafa', text: '#333333', border: '#e0e0e0', inputBg: '#ffffff' }

  return (
    <div className={`settings-view ${theme}`} style={{ backgroundColor: themeColors.bg, color: themeColors.text }}>
      <div className="settings-container">
        <div className="settings-header">
          <h2>设置</h2>
          <button className="close-btn" onClick={() => setShowSettings(false)}>
            ✕
          </button>
        </div>

        <div className="settings-section">
          <h3>显示设置</h3>
          <div className="setting-item">
            <label>字体大小 (px)</label>
            <input
              type="number"
              min="12"
              max="200"
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: parseInt(e.target.value) || 48 })}
            />
          </div>
          <div className="setting-item">
            <label>字体颜色</label>
            <input
              type="color"
              value={settings.fontColor}
              onChange={(e) => updateSettings({ fontColor: e.target.value })}
            />
          </div>
          <div className="setting-item">
            <label>背景颜色</label>
            <input
              type="color"
              value={settings.backgroundColor}
              onChange={(e) => updateSettings({ backgroundColor: e.target.value })}
            />
          </div>
          <div className="setting-item">
            <label>行间距</label>
            <input
              type="number"
              min="1"
              max="3"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => updateSettings({ lineHeight: parseFloat(e.target.value) || 1.6 })}
            />
          </div>
          <div className="setting-item">
            <label>字体加粗</label>
            <select
              value={settings.fontWeight}
              onChange={(e) => updateSettings({ fontWeight: e.target.value as 'normal' | 'bold' })}
            >
              <option value="normal">正常</option>
              <option value="bold">加粗</option>
            </select>
          </div>
          <div className="setting-item">
            <label>背景和边框透明</label>
            <input
              type="checkbox"
              checked={settings.transparent}
              onChange={(e) => updateSettings({ transparent: e.target.checked })}
            />
          </div>
          <div className="setting-item">
            <label>轮播间隔 (秒)</label>
            <input
              type="number"
              min="1"
              max="60"
              value={settings.interval}
              onChange={(e) => updateSettings({ interval: parseInt(e.target.value) || 3 })}
            />
          </div>
        </div>

        <div className="settings-section">
          <div className="settings-section-header">
            <h3>语料管理 ({corpusList.length} 条)</h3>
            {corpusList.length > 0 && (
              <button
                className="export-btn"
                onClick={handleExport}
                title="导出语料为txt文本"
              >
                📥 导出
              </button>
            )}
          </div>
          <div className="corpus-list">
            {corpusList.length === 0 ? (
              <p className="empty-hint">暂无语料，点击 "➕ 添加语料" 添加</p>
            ) : (
              corpusList.map((item) => (
                <div key={item.id} className="corpus-item">
                  {editingId === item.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit(item.id)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <button onClick={() => handleSaveEdit(item.id)}>✓</button>
                      <button onClick={handleCancelEdit}>✕</button>
                    </div>
                  ) : (
                    <>
                      <span className="corpus-text">{item.text}</span>
                      <div className="corpus-actions">
                        <button onClick={() => handleEdit(item.id, item.text)}>编辑</button>
                        <button onClick={() => deleteCorpus(item.id)}>删除</button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
