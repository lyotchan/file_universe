// components/FileInfoCard.tsx
import Image from 'next/image'
import { formatFileSize } from '@/lib/utils/converts'
import ModalInput from '../ModalInput'
import { FileType } from '.'
import { useState } from 'react'
import downloadLargeFile from '@/lib/utils/download_file'
import {
  ArrowDownTrayIcon,
  PlayIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
const FileInfoCard = ({
  name,
  size,
  previewUrl,
  isCreateFolder,
  isDirectory,
  breadcrumbs: [breadcrumbs, setBreadcrumbs]
}: FileType) => {
  const [isOpen, setIsOpen] = useState(false)

  async function createFolder(folderName, folderPath) {
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
    } catch (error) {
      throw new Error(error.message)
    }
  }

  function openFolder(folderName) {
    setBreadcrumbs([
      ...breadcrumbs,
      { path: folderName + '/', name: folderName }
    ])
  }

  const handleConfirm = async (folderName: string) => {
    const invalidCharacters = /[<>:"/\\|?*]/
    if (!invalidCharacters.test(folderName)) {
      try {
        await createFolder(
          folderName,
          breadcrumbs.reduce((a, b) => a + b.path, '')
        )
        setIsOpen(false)
      } catch (e) {
        alert(e.message)
      }
    } else {
      alert('无效的文件夹名，请避免使用以下字符：\\ / : * ? " < > |')
    }
  }

  const handleCancel = () => {
    console.log('取消创建文件夹')
    setIsOpen(false)
  }
  return (
    <div className="relative w-full transform-gpu cursor-pointer self-start rounded-lg p-2 shadow-md transition duration-300 ease-in-out will-change-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="w-full overflow-hidden rounded-t-lg">
        <Image
          src={previewUrl}
          alt={name}
          width={138}
          height={138}
          priority={true}
          className="mx-auto rounded-t-lg object-cover"
        />
      </div>
      <div className="p-2">
        <h3 className="truncate text-left text-sm font-semibold">{name}</h3>
        {!isCreateFolder && !isDirectory && (
          <p className="text-xs">{formatFileSize(size)}</p>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 rounded-lg bg-base-200 bg-opacity-80 opacity-0 bg-blend-darken transition-opacity duration-300 ease-in-out hover:opacity-100">
        {isCreateFolder ? (
          <>
            <button
              onClick={() => setIsOpen(true)}
              className="btn-ghost btn-active btn-sm btn inline-flex items-center"
            >
              <FolderPlusIcon className="h-4 w-4 md:mr-1" />
              <span className="hidden md:inline">create</span>
            </button>
            <ModalInput
              isOpen={isOpen}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </>
        ) : (
          <>
            {isDirectory ? (
              <button
                onClick={() => {
                  openFolder(name)
                }}
                className="btn-ghost btn-active btn-sm btn inline-flex items-center"
              >
                <FolderOpenIcon className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">打开</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    downloadLargeFile(
                      breadcrumbs.reduce((a, b) => a + b.path, '') + name
                    )
                  }}
                  className="btn-ghost btn-active btn-sm btn inline-flex items-center"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">下载</span>
                </button>
                <button className="btn-ghost btn-active btn-sm btn inline-flex items-center">
                  <PlayIcon className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">观看</span>
                </button>
                <button className="btn-ghost btn-active btn-sm btn inline-flex items-center">
                  <EyeIcon className="h-4 w-4 md:mr-1" />
                  <span className="hidden md:inline">预览</span>
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default FileInfoCard
