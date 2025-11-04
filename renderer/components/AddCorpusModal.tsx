import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import './AddCorpusModal.css'

export default function AddCorpusModal() {
  const { addCorpus, setShowAddModal } = useAppStore()
  const [inputText, setInputText] = useState('')

  const handleSubmit = () => {
    if (inputText.trim()) {
      const lines = inputText.split('\n')
      addCorpus(lines)
      setInputText('')
      setShowAddModal(false)
    }
  }

  const handleCancel = () => {
    setInputText('')
    setShowAddModal(false)
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>添加语料</h3>
          <button className="close-btn" onClick={handleCancel}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <textarea
            className="corpus-input"
            placeholder="每行输入一条语料，支持一次性添加多条&#10;例如：&#10;Hello World&#10;How are you&#10;Nice to meet you"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={10}
            autoFocus
          />
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleCancel}>
            取消
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            添加
          </button>
        </div>
      </div>
    </div>
  )
}
