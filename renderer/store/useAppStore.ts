import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CorpusItem {
    id: string
    text: string
}

export interface AppSettings {
    fontSize: number
    fontColor: string
    backgroundColor: string
    lineHeight: number
    interval: number // 秒
    fontWeight: 'normal' | 'bold' // 字体加粗
    transparent: boolean // 背景和边框透明
}

interface AppState {
    // 语料数据
    corpusList: CorpusItem[]
    currentIndex: number

    // 设置
    settings: AppSettings

    // UI 状态
    isPlaying: boolean
    showSettings: boolean
    showAddModal: boolean
    fishMode: boolean // 摸鱼模式
    theme: 'light' | 'dark' // 主题

    // Actions
    setCurrentIndex: (index: number) => void
    addCorpus: (texts: string[]) => void
    deleteCorpus: (id: string) => void
    updateCorpus: (id: string, text: string) => void
    updateSettings: (settings: Partial<AppSettings>) => void
    togglePlay: () => void
    setShowSettings: (show: boolean) => void
    setShowAddModal: (show: boolean) => void
    setFishMode: (fishMode: boolean) => void
    setTheme: (theme: 'light' | 'dark') => void
    toggleTheme: () => void
    nextCorpus: () => void
    prevCorpus: () => void
}

const defaultSettings: AppSettings = {
    fontSize: 48,
    fontColor: '#333333',
    backgroundColor: '#ffffff',
    lineHeight: 1.6,
    interval: 3,
    fontWeight: 'bold', // 默认加粗
    transparent: false, // 默认不透明
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            corpusList: [],
            currentIndex: 0,
            settings: defaultSettings,
            isPlaying: true, // 默认启动
            showSettings: false,
            showAddModal: false,
            fishMode: false,
            theme: 'light', // 默认浅色主题

            setCurrentIndex: (index) => {
                const { corpusList } = get()
                if (index >= 0 && index < corpusList.length) {
                    set({ currentIndex: index })
                }
            },

            addCorpus: (texts) => {
                const newItems: CorpusItem[] = texts
                    .map((text) => text.trim())
                    .filter((text) => text.length > 0)
                    .map((text) => ({
                        id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
                        text,
                    }))

                set((state) => ({
                    corpusList: [...state.corpusList, ...newItems],
                }))
            },

            deleteCorpus: (id) => {
                set((state) => {
                    const newList = state.corpusList.filter((item) => item.id !== id)
                    const newIndex = Math.min(state.currentIndex, newList.length - 1)
                    return {
                        corpusList: newList,
                        currentIndex: Math.max(0, newIndex),
                    }
                })
            },

            updateCorpus: (id, text) => {
                set((state) => ({
                    corpusList: state.corpusList.map((item) =>
                        item.id === id ? { ...item, text } : item
                    ),
                }))
            },

            updateSettings: (newSettings) => {
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                }))
            },

            togglePlay: () => {
                set((state) => ({ isPlaying: !state.isPlaying }))
            },

            setShowSettings: (show) => {
                set({ showSettings: show })
            },

            setShowAddModal: (show) => {
                set({ showAddModal: show })
            },

            setFishMode: (fishMode) => {
                set({ fishMode })
            },

            setTheme: (theme) => {
                set({ theme })
            },

            toggleTheme: () => {
                set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
            },

            nextCorpus: () => {
                const { corpusList, currentIndex } = get()
                if (corpusList.length === 0) return
                const nextIndex = (currentIndex + 1) % corpusList.length
                set({ currentIndex: nextIndex })
            },

            prevCorpus: () => {
                const { corpusList, currentIndex } = get()
                if (corpusList.length === 0) return
                const prevIndex = currentIndex === 0 ? corpusList.length - 1 : currentIndex - 1
                set({ currentIndex: prevIndex })
            },
        }),
        {
            name: 'lexiloop-storage',
            partialize: (state) => ({
                corpusList: state.corpusList,
                currentIndex: state.currentIndex,
                settings: state.settings,
                theme: state.theme,
                // 不保存播放状态和摸鱼模式，总是默认启动
            }),
        }
    )
)
