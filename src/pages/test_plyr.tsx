import { useEffect, useRef } from 'react'

const VideoPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)
  const mediaSourceRef = useRef<MediaSource | null>(null)

  useEffect(() => {
    ;(async () => {
      const response = await fetch(`/api/video_meta/frag_bunny.mp4`)
      const { codec, mimeType } = await response.json()

      const mimeCodec = `${mimeType}; codecs="${codec}"`
      console.log(mimeCodec, MediaSource.isTypeSupported(mimeCodec))
      if (videoRef.current) {
        mediaSourceRef.current = new MediaSource()
        videoRef.current.src = URL.createObjectURL(mediaSourceRef.current)
        mediaSourceRef.current!.addEventListener('sourceopen', () => {
          console.log(
            'addSourceBuffer',
            mediaSourceRef.current?.readyState,
            sourceBufferRef.current?.updating
          )
          sourceBufferRef.current =
            mediaSourceRef.current!.addSourceBuffer(mimeCodec)

          sourceBufferRef.current.addEventListener('updatestart', () => {
            console.log(
              'updatestart',
              mediaSourceRef.current?.readyState,
              sourceBufferRef.current?.updating
            )
            console.log('SourceBuffer update has started.')
          })

          sourceBufferRef.current.addEventListener('update', () => {
            console.log('SourceBuffer is updating.')
          })

          sourceBufferRef.current.addEventListener('updateend', () => {
            // mediaSourceRef.current.endOfStream();
            console.log('SourceBuffer update has ended.')
          })
          mediaSourceRef.current!.addEventListener('error', function (event) {
            console.error('MediaSource error:', event)
          })

          sourceBufferRef.current.addEventListener('error', function (event) {
            console.error('SourceBuffer error:', event)
          })
          loadNextSegment('/frag_bunny.mp4')
        })

        mediaSourceRef.current!.addEventListener('sourceended', () => {
          console.log('MediaSource has reached the end of the stream.')
        })

        mediaSourceRef.current!.addEventListener('sourceclose', () => {
          console.log('MediaSource is closing or has been closed.')
        })
      }
    })()

    return () => {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const SEGMENT_SIZE = 9 * 1024 * 1024 // 1MB per segment
  let nextSegmentStart = 0
  const loadNextSegment = async (videoId: string) => {
    try {
      const end = nextSegmentStart + SEGMENT_SIZE - 1
      // const response = await fetch(
      //   `/api/video${videoId}?start=${nextSegmentStart}`,
      //   { cache: 'no-store' }
      // )
      // const data = await response.arrayBuffer()

      const fetchAB = function (url: string, cb: Function) {
        console.log(url)
        const xhr = new XMLHttpRequest()
        xhr.open('get', url)
        xhr.responseType = 'arraybuffer'
        xhr.onload = () => {
          cb(xhr.response)
        }
        xhr.send()
      }
      console.log(
        'appendBuffer',
        mediaSourceRef.current?.readyState,
        sourceBufferRef.current?.updating
      )
      fetchAB(
        `/api/video${videoId}?start=${nextSegmentStart}`,
        (data: BufferSource) => {
          sourceBufferRef.current?.appendBuffer(data)
        }
      )
    } catch (error) {
      console.error('Error loading segment:', error)
    }
  }
  return (
    <div>
      <video ref={videoRef} controls crossOrigin="anonymous"></video>
    </div>
  )
}

export default VideoPage
