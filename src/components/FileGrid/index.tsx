import { useState, useEffect } from 'react'
import Link from 'next/link'
import FileInfoCard from './FileInfoCard'

// type FileType = {
//   name: string
//   size: string
//   previewUrl: string
//   isCreateFolder?: boolean
// }
export interface FileType {
  name: string
  size: number
  previewUrl: string
  isDirectory?: boolean
  isCreateFolder?: boolean
  [key: string]: any // 允许接口具有其他任意属性
}
interface breadcrumbsType {
  path: string
  name: string
}
const FileGrid = () => {
  const [files, setFiles] = useState<Array<FileType>>([
    {
      name: 'Create Folder',
      size: 0,
      previewUrl: '/imgs/add_folder_icon.png',
      isCreateFolder: true
    }
  ])

  const [breadcrumbs, setBreadcrumbs] = useState<Array<breadcrumbsType>>([
    {
      path: '/',
      name: 'Home'
    }
  ])

  function selectBreadcrumbs(targetIndex) {
    setBreadcrumbs(breadcrumbs.slice(0, targetIndex + 1))
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          '/api/fileInfo/any' + breadcrumbs.reduce((a, b) => a + b.path, '')
        )
        const responseData = await response.json()
        responseData.push({
          name: 'Create Folder',
          size: 0,
          previewUrl: '/imgs/add_folder_icon.png',
          isCreateFolder: true
        })
        setFiles(responseData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [breadcrumbs]) // 空数组作为依赖项，仅在组件挂载时发起请求
  return (
    <div className="container mx-auto mb-2 px-4 pt-20">
      <div className="breadcrumbs max-w-full text-sm">
        <ul>
          {breadcrumbs.map(({ path, name }, index) => (
            <li
              className="link-hover link"
              key={path}
              onClick={() => {
                selectBreadcrumbs(index)
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="mr-2 h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="grid auto-rows-min grid-cols-[repeat(auto-fill,minmax(156px,166px))] gap-3">
        {files.map((file, index) => (
          <FileInfoCard
            key={index}
            name={file.name}
            size={file.size}
            previewUrl={file.previewUrl}
            isCreateFolder={file.isCreateFolder}
            isDirectory={file.isDirectory}
            breadcrumbs={[breadcrumbs, setBreadcrumbs]}
          />
        ))}
      </div>
    </div>
  )
}

export default FileGrid
