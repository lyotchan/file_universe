// import { createContext, useContext } from 'react'
// const IndexContext = createContext(null)

// export default IndexContext
// export const useIndexContext = () => useContext(IndexContext)
import { createContext, useContext } from 'react'

// 创建一个类型描述数据结构
export interface IndexContextType {
  header: {
    title: string
    searchBarPlaceholder: string
    cancelBtn: string
    themes: { value: string; label: string }[]
    themeLabel: string
  }
  footer: {
    owner: string
    desc: string
    socialMedia: string
  }
  content: Record<string, unknown>
}

// 使用类型创建上下文，并提供一个初始值
const IndexContext = createContext<IndexContextType>({
  header: {
    title: 'WuKong',
    searchBarPlaceholder: 'Search...',
    cancelBtn: 'cancel',
    themes: [{ value: 'light', label: 'light' }],
    themeLabel: 'Theme'
  },
  footer: {
    owner: 'Lyot Chan',
    desc: 'Providing reliable tech since 2023',
    socialMedia: 'SOCIAL'
  },
  content: {}
})

export default IndexContext
export const useIndexContext = () => useContext(IndexContext)
