import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import ReactDOM from 'react-dom'
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
const ImageViewer = ({
  src,
  isShow,
  setIsShow
}: {
  src: string
  isShow: boolean
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [imgRoot, setImgRoot] = useState<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [prevDistance, setPrevDistance] = useState<number | null>(null)

  const closeMark = () => {
    document.body.classList.remove('overflow-hidden')
    setIsShow(false)
    setPosition({ x: 0, y: 0 })
    setRotation(0)
    setScale(1)
  }

  useEffect(() => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    setImgRoot(root)
    return () => {
      document.body.removeChild(root)
    }
  }, [])

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    setScale(prevScale => {
      const newScale = prevScale - e.deltaY * 0.001
      return (newScale > 0.2 && newScale < prevScale) ||
        (newScale < 2.4 && newScale > prevScale)
        ? newScale
        : prevScale
    })
  }, [])

  useEffect(() => {
    const imageElement = imageRef.current
    if (imageElement) {
      imageElement.addEventListener('wheel', handleWheel, { passive: false })
    }
    return () => {
      if (imageElement) {
        imageElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [src, handleWheel])
  const handleMouseDown = () => {
    setDragging(true)
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      setPosition({ x: position.x + e.movementX, y: position.y + e.movementY })
    }
  }

  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 })

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true)
    setStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = () => {
    setDragging(false)
    setPrevDistance(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      )
      if (prevDistance) {
        setScale(scale * (distance / prevDistance))
      }
      setPrevDistance(distance)
    } else if (dragging) {
      setPosition({
        x: position.x + (e.touches[0].clientX - startPosition.x),
        y: position.y + (e.touches[0].clientY - startPosition.y)
      })
      setStartPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
    }
  }
  const handleRotate = () => {
    setRotation(rotation + 90)
  }

  if (!imgRoot) {
    return null
  }
  const content = (
    <div
      className={`fixed left-0 top-0 z-50 h-full w-full items-center justify-center bg-default-theme ${
        isShow ? 'flex' : 'hidden'
      }`}
    >
      <XMarkIcon
        onClick={closeMark}
        className="absolute right-6 top-6 z-50 h-6 w-6 cursor-pointer text-base-content"
      ></XMarkIcon>
      <div className="h-2/4 w-2/4">
        <Image
          src={src}
          alt=""
          width={0}
          height={0}
          className="h-full w-full select-none object-contain"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale})`,
            transition: dragging ? 'none' : 'all 0.1s linear',
            cursor: 'move'
          }}
          unoptimized
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          ref={imageRef}
          onDragStart={e => e.preventDefault()}
        />
        <div className="relative z-50 mt-4 flex justify-center">
          <button onClick={handleRotate} className="btn-active btn">
            <ArrowPathIcon className="h-6 w-6 cursor-pointer"></ArrowPathIcon>
          </button>
        </div>
      </div>
    </div>
  )
  return ReactDOM.createPortal(content, imgRoot)
}

export default ImageViewer
