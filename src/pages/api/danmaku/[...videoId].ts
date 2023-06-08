import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { resource_path } from '@/lib/constants/index'
const danmakuDir = path.join(...resource_path)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const videoId = req.query.videoId as Array<string>
  const filename = videoId?.pop()
  if (!filename) {
    return res.status(400).json({ message: 'Invalid params' })
  }
  if (req.method === 'POST') {
    const newDanmaku = req.body
    if (!newDanmaku) {
      res.status(400).json({ message: 'Invalid danmaku data' })
      return
    }
    const danmakuFilePath = path.join(
      danmakuDir,
      ...videoId,
      `${filename}.json`
    )

    // 检查文件是否存在，不存在则创建一个空数组
    if (!fs.existsSync(danmakuFilePath)) {
      fs.writeFileSync(danmakuFilePath, JSON.stringify([]))
    }

    // 读取弹幕数据
    const fileContent = fs.readFileSync(danmakuFilePath, 'utf-8')
    const danmakus = JSON.parse(fileContent)

    // 添加新弹幕
    danmakus.push(newDanmaku)

    // 保存弹幕数据
    fs.writeFileSync(danmakuFilePath, JSON.stringify(danmakus))

    res.status(200).json({ message: 'Danmaku saved' })
  } else if (req.method === 'GET') {
    const danmakuFilePath = path.join(
      danmakuDir,
      ...videoId,
      `${filename}.json`
    )

    // 如果文件不存在，返回空数组
    if (!fs.existsSync(danmakuFilePath)) {
      res.status(200).json([])
      return
    }

    // 读取并返回弹幕数据
    const fileContent = fs.readFileSync(danmakuFilePath, 'utf-8')
    const danmakus = JSON.parse(fileContent)
    res.status(200).json(danmakus)
  } else {
    res.status(405).json({ message: 'Method not allowed' })
  }
}
