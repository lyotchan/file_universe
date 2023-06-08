export interface breadcrumbsType {
  path: string
  name: string
}
export interface FileType {
  index?: number
  name: string
  size?: number
  previewUrl: string
  isDirectory?: boolean
  isCreateFolder?: boolean
  // [key: string]: any // 允许接口具有其他任意属性
  isVideo?: boolean
  isImage?: boolean
}

export interface FileCardPropsType {
  index: number // 将 index 定义为 number 类型
  name: string
  size: number
  previewUrl: string
  isCreateFolder: boolean
  isDirectory: boolean
  breadcrumbs: [
    Array<breadcrumbsType>,
    React.Dispatch<React.SetStateAction<Array<breadcrumbsType>>>
  ]
  isVideo: boolean
  setSrc: React.Dispatch<React.SetStateAction<string>>
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>
  isImage: boolean
  [key: string]: any
}

export interface searchContentType {
  searchContent: string
}

export interface searchContentProps {
  searchContent: string // 假设你的 searchContent 是 string 类型
  setSearchContent: React.Dispatch<React.SetStateAction<string>>
}
export interface cacheType {
  [key: string]: string
}
export type H264Profile =
  | 'Baseline'
  | 'Main'
  | 'High'
  | 'High 10'
  | 'High 4:2:2'
  | 'High 4:4:4'
export type AACProfiles = 'LC' | 'HE-AAC' | 'HE-AACv2' | 'LD' | 'ELD'
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
