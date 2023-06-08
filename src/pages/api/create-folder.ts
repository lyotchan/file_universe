// pages/api/create-folder.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { resource_path } from '@/lib/constants/index'
interface CreateFolderRequestBody {
  folderName: string
  folderPath: string
}

const createFolderHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).end({ message: 'Method Not Allowed' })
  }

  const { folderName, folderPath }: CreateFolderRequestBody = req.body

  // 对文件夹名称进行验证，例如检查是否包含非法字符
  // 请根据您的需求自定义验证规则
  const isValidFolderName = (name: string) => {
    const regex = /^[^<>:"/\\|?*\x00-\x1F]+$/
    return regex.test(name)
  }

  if (!isValidFolderName(folderName)) {
    return res.status(400).json({ message: 'Invalid folder name' })
  }

  // 在服务器文件系统上创建文件夹
  console.log('folderPath', folderPath)

  const folderFullPath = path.join(...resource_path, folderPath, folderName)
  try {
    fs.mkdirSync(folderFullPath)
    res.status(200).json({ message: 'Folder created successfully' })
  } catch (error) {
    console.error('Error creating folder:', error)
    res.status(500).json({ message: 'Error creating folder' })
  }
}

export default createFolderHandler
