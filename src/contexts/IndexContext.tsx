import { createContext, useContext } from 'react'
import type { IndexContextType } from '@/lib/types'

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
