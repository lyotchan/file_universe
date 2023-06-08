// components/FileInfoCard.tsx
import { useRouter } from 'next/router'
import { useState } from 'react'

import {
  ArrowDownTrayIcon,
  PlayIcon,
  FolderOpenIcon,
  FolderPlusIcon,
  EyeIcon,
  ArrowUpTrayIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

import type { breadcrumbsType, FileCardPropsType } from '@/lib/types'

import { formatFileSize } from '@/lib/utils/converts'
import downloadLargeFile from '@/lib/utils/download_file'
import grid from '@/styles/grid.module.css'
const FileInfoCard = ({
  index,
  name,
  size,
  previewUrl,
  isCreateFolder,
  isDirectory,
  breadcrumbs: [breadcrumbs, setBreadcrumbs],
  isVideo,
  setSrc,
  setIsShow,
  isImage,
  setIsOpen
}: FileCardPropsType) => {
  const router = useRouter()

  const watchVideo = (fileName: string) => {
    router.push('/plyr?routes=' + fileName)
  }

  const previewFile = (filePath: string) => {
    setSrc(`/api/image?imagePath=${filePath}`)
    setIsShow(true)
    document.body.classList.add('overflow-hidden')
  }

  function openFolder(folderName: string) {
    setBreadcrumbs([
      ...breadcrumbs,
      { path: folderName + '/', name: folderName }
    ])
  }

  const random = [5, 6, 8]

  const prevPath: string = breadcrumbs.reduce(
    (a: string, b: breadcrumbsType) => a + b.path,
    ''
  )
  return (
    <div
      className={`relative ${
        grid['grid-row-end' + random[index % 3]]
      } flex w-full transform-gpu cursor-pointer flex-col rounded-lg p-2 shadow-md transition duration-300 ease-in-out will-change-transform hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="w-full flex-1 overflow-hidden rounded-t-lg px-2">
        <div
          aria-label="image"
          style={{
            backgroundImage: `url('${encodeURIComponent(previewUrl)}')`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
          className="h-full w-full"
        ></div>
      </div>
      <div className="flex-shrink-0 p-2">
        <h3 className="truncate text-left text-sm font-semibold">{name}</h3>
        {!isCreateFolder && !isDirectory && (
          <p className="text-xs">{formatFileSize(size)}</p>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-base-200 bg-opacity-80 opacity-0 bg-blend-darken transition-opacity duration-300 ease-in-out hover:opacity-100">
        <div className="flex w-max flex-col justify-center space-y-1">
          {isCreateFolder ? (
            <>
              <button
                onClick={() => setIsOpen(true)}
                className="btn-ghost btn-active btn-sm btn inline-flex w-full items-center"
              >
                <FolderPlusIcon className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">create</span>
              </button>
              <button
                onClick={() => {}}
                className="btn-ghost btn-active btn-sm btn inline-flex w-full items-center"
              >
                <ArrowUpTrayIcon className="h-4 w-4 md:mr-1" />
                <span className="hidden md:inline">Upload</span>
              </button>
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
                      downloadLargeFile(prevPath + name)
                    }}
                    className="btn-ghost btn-active btn-sm btn inline-flex items-center"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 md:mr-1" />
                    <span className="hidden md:inline">下载</span>
                  </button>
                  {isVideo && (
                    <button
                      onClick={() => {
                        watchVideo(prevPath + name)
                      }}
                      className="btn-ghost btn-active btn-sm btn inline-flex items-center"
                    >
                      <PlayIcon className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">观看</span>
                    </button>
                  )}
                  {isImage && (
                    <button
                      onClick={() => previewFile(prevPath + name)}
                      className="btn-ghost btn-active btn-sm btn inline-flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 md:mr-1" />
                      <span className="hidden md:inline">预览</span>
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default FileInfoCard
