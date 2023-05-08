// components/ModalInput.tsx
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styles from '@/styles/modal.module.css'
interface ModalInputProps {
  isOpen: boolean
  onConfirm: (folderName: string) => void
  onCancel: () => void
}

const ModalInput = ({ isOpen, onConfirm, onCancel }: ModalInputProps) => {
  const [folderName, setFolderName] = useState('')
  const [modalRoot, setModalRoot] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    setModalRoot(root)

    return () => {
      document.body.removeChild(root)
    }
  }, [])

  const handleConfirm = () => {
    console.log('创建文件夹:', folderName)
    onConfirm(folderName)
    setFolderName('')
  }

  const handleCancel = () => {
    console.log('取消创建文件夹')
    setFolderName('')
    onCancel()
  }

  if (!modalRoot) {
    return null
  }

  return ReactDOM.createPortal(
    <>
      <input
        type="checkbox"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">请输入文件夹名</h3>
          <input
            className="input-bordered input mt-4 w-full"
            placeholder="文件夹名"
            value={folderName}
            onChange={e => setFolderName(e.target.value)}
          />
          <div className="modal-action mt-4 flex justify-center space-x-4">
            <button className="btn-primary btn" onClick={handleConfirm}>
              确定
            </button>
            <button className="btn-ghost btn" onClick={handleCancel}>
              取消
            </button>
          </div>
        </div>
      </div>
    </>,
    modalRoot
  )
}

export default ModalInput
