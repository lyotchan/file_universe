// src/components/Card.tsx
interface CardProps {
  fileType: string
}

const FileInfoCard = ({ fileType }: CardProps) => {
  return <div className="rounded-md bg-blue-500 p-4 text-white">{fileType}</div>
}

export default FileInfoCard
