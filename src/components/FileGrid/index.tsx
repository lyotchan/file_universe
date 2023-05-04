import Card from './FileInfoCard'

const files = [
  { id: 1, type: 'video' },
  { id: 2, type: 'audio' },
  { id: 3, type: 'txt' }
  // Add more files as needed
]

const FileGrid = () => {
  return (
    <div className="container mx-auto my-8 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {files.map(file => (
        <Card key={file.id} fileType={file.type} />
      ))}
    </div>
  )
}

export default FileGrid
