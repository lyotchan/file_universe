import { useState, useEffect } from 'react'
import Link from 'next/link'
import FileInfoCard from './FileInfoCard'

import { ChevronDoubleUpIcon } from '@heroicons/react/24/outline'
import ImageViewer from '../ImageViewer'
import ModalInput from '../ModalInput'

import type { breadcrumbsType, FileType, searchContentType } from '@/lib/types'

const FileGrid = ({ searchContent }: searchContentType) => {
  const [isOpen, setIsOpen] = useState(false)

  const [files, setFiles] = useState<Array<FileType>>([
    {
      name: 'Create Folder',
      previewUrl: '/imgs/add_folder_icon.png',
      isCreateFolder: true
    }
  ])
  const [src, setSrc] = useState('/')
  const [isShow, setIsShow] = useState(false)

  const [breadcrumbs, setBreadcrumbs] = useState<Array<breadcrumbsType>>([
    {
      path: '/',
      name: 'Home'
    }
  ])

  function selectBreadcrumbs(targetIndex: number) {
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

  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
  async function createFolder(folderName: string, folderPath: string) {
    try {
      const response = await fetch('/api/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folderName,
          folderPath
        })
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message)
      }
      console.log('Folder created successfully:', data)
    } catch (error: unknown) {
      if (typeof error === 'string') {
        throw new Error(error)
      } else if (error instanceof Error) {
        throw error
      } else {
        throw new Error('An unknown error occurred')
      }
    }
  }

  const handleConfirm = async (folderName: string) => {
    const invalidCharacters = /[<>:"/\\|?*]/
    if (!invalidCharacters.test(folderName)) {
      try {
        await createFolder(
          folderName,
          breadcrumbs.reduce((a: string, b: breadcrumbsType) => a + b.path, '')
        )
        setIsOpen(false)
      } catch (e: unknown) {
        if (e instanceof Error) {
          alert(e.message)
        } else {
          console.log(e)
        }
      }
    } else {
      alert('无效的文件夹名，请避免使用以下字符：\\ / : * ? " < > |')
    }
  }
  const handleCancel = () => {
    console.log('取消创建文件夹')
    setIsOpen(false)
  }
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])
  console.log(searchContent, 'fileGrid')
  return (
    <div className="container mx-auto mb-2 px-4 pt-20">
      <ModalInput
        isOpen={isOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      <ImageViewer
        src={src}
        isShow={isShow}
        setIsShow={setIsShow}
      ></ImageViewer>
      <div className="breadcrumbs mb-2 max-w-full text-base">
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
      <div className="grid auto-rows-20 grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3">
        {files
          .filter(file => file.name.includes(searchContent))
          .map((file, index) => (
            <FileInfoCard
              key={index}
              setSrc={setSrc}
              setIsShow={setIsShow}
              index={index}
              name={file.name}
              size={file.size || 0}
              previewUrl={file.previewUrl}
              isCreateFolder={file.isCreateFolder || false}
              isDirectory={file.isDirectory || false}
              breadcrumbs={[breadcrumbs, setBreadcrumbs]}
              isVideo={file.isVideo || false}
              isImage={file.isImage || false}
              setIsOpen={setIsOpen}
            />
          ))}
      </div>
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 cursor-pointer rounded-full bg-primary p-2"
        >
          <ChevronDoubleUpIcon className="h-4 w-4 text-base-200" />
        </div>
      )}
    </div>
  )
}

export default FileGrid
