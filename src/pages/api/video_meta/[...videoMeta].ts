import type { H264Profile, AACProfiles } from '@/lib/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import mime from 'mime-types'
import { resource_path } from '@/lib/constants/index'
import ffmpeg from 'fluent-ffmpeg'
import ffprobePath from 'ffprobe-static'

ffmpeg.setFfprobePath(ffprobePath.path)
// Mapping for H.264 video codec profiles
const h264Profiles: Record<H264Profile, string> = {
  Baseline: '42E01E',
  Main: '4D401E',
  High: '64001E',
  'High 10': '6E001E',
  'High 4:2:2': '7A001E',
  'High 4:4:4': 'F4001E'
}

// Mapping for AAC audio codec profiles
const aacProfiles: Record<AACProfiles, string> = {
  LC: 'mp4a.40.2',
  'HE-AAC': 'mp4a.40.5',
  'HE-AACv2': 'mp4a.40.29',
  LD: 'mp4a.40.23',
  ELD: 'mp4a.40.39'
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { videoMeta } = req.query
    const videoPath = path.join(...resource_path, ...(videoMeta as string[])) // Adjust according to your video file's location
    await new Promise<void>(resolve => {
      ffmpeg.ffprobe(videoPath, function (err, metadata) {
        if (err) {
          console.log('err', err)
          res.status(500).json({ error: 'Error getting video metadata' })
          return
        }

        const videoStream = metadata.streams.find(
          stream => stream.codec_type === 'video'
        )
        const audioStream = metadata.streams.find(
          stream => stream.codec_type === 'audio'
        )

        if (videoStream && audioStream) {
          const videoStreamProfile = videoStream.profile || 'Baseline'
          const audioStreamProfile = audioStream.profile || 'LC'
          const videoCodec =
            'avc1.' +
            (h264Profiles[videoStreamProfile as H264Profile] || '42E01E') // Use Baseline profile as default
          const audioCodec =
            aacProfiles[audioStreamProfile as AACProfiles] || 'mp4a.40.2' // Use LC profile as default
          const contentType =
            mime.lookup(videoPath) || 'application/octet-stream'

          const videoMetadata = {
            duration: metadata.format.duration,
            codec: `${videoCodec}, ${audioCodec}`,
            dimensions: {
              width: videoStream.width,
              height: videoStream.height
            },
            mimeType: contentType
          }

          res.status(200).json(videoMetadata)
        } else {
          res.status(404).json({ error: 'Video or audio stream not found' })
        }
        resolve()
      })
    })
  } catch (e) {
    console.log(e)
    e instanceof Error
      ? res.status(500).json({ error: e.message })
      : res.status(500).json({ error: 'unkown error at video_meta api' })
  }
}
