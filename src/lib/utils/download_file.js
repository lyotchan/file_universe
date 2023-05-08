import { openDB, deleteDB } from 'idb'

let controller
let signal
let downloadedBytes = 0
let db
let fileName
async function init() {
  db = await openDB('downloadDB', 1, {
    upgrade(db) {
      db.createObjectStore('chunks')
    }
  })
}

export default async function downloadLargeFile(filePath) {
  const downloadUrl = '/api/download' + filePath
  console.log(downloadUrl)
  if (!db) {
    await init()
  }

  controller = new AbortController()
  signal = controller.signal

  const response = await fetch(downloadUrl, {
    headers: { Range: `bytes=${downloadedBytes}-` },
    signal
  })

  if (!response.ok) {
    alert('Error downloading file')
  }
  // Get the file name from the response headers
  const contentDisposition = response.headers.get('Content-Disposition')
  fileName = contentDisposition.match(/filename\*=UTF-8''(.+)/)[1]

  const reader = response.body.getReader()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      downloadedBytes += value.byteLength
      await saveChunk(value)
    }
    mergeAndDownload()
    console.log('Download complete')
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Download paused')
    } else {
      throw error
    }
  } finally {
    reader.releaseLock()
  }
}

async function saveChunk(chunk) {
  const tx = db.transaction('chunks', 'readwrite')
  const store = tx.objectStore('chunks')

  await store.put(chunk, downloadedBytes)
  await tx.done
}

function pauseDownload() {
  if (controller) {
    controller.abort()
  }
}

async function resumeDownload() {
  await downloadLargeFile()
}

// async function mergeAndDownload() {
//   const chunks = [];

//   let cursor = await db.transaction('chunks').store.openCursor();

//   while (cursor) {
//     chunks.push(cursor.value);
//     cursor = await cursor.continue();
//   }

//   // Use Blob to merge chunks without loading all of them into memory
//   const file = new Blob(chunks, {
//     type: 'application/octet-stream',
//   });

//   const url = URL.createObjectURL(file);

//   // Use the original file name for the download
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = fileName;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   URL.revokeObjectURL(url)
// }

async function mergeAndDownload() {
  // A custom ReadableStream that reads and merges chunks from IndexedDB
  const customStream = new ReadableStream({
    async start(controller) {
      let cursor = await db.transaction('chunks').store.openCursor()

      while (cursor) {
        controller.enqueue(cursor.value)
        cursor = await cursor.continue()
      }

      controller.close()
    }
  })

  // Merge chunks using a Response object and a custom ReadableStream
  const response = new Response(customStream)
  const file = await response.blob()

  const url = URL.createObjectURL(file)

  // Use the original file name for the download
  const link = document.createElement('a')
  link.href = url
  link.download = decodeURIComponent(fileName)
  document.body.appendChild(link)
  link.click()

  downloadedBytes = 0
  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  // await deleteDB('downloadDB')

  // Clear IndexedDB data

  const transaction = db.transaction(['chunks'], 'readwrite')
  const objectStore = transaction.objectStore('chunks')
  const clearRequest = objectStore.clear()

  clearRequest.onsuccess = () => {
    console.log('IndexedDB data cleared.')
  }

  clearRequest.onerror = () => {
    console.error('Error clearing IndexedDB data.')
  }
  // const indexedDB =
  //   window.indexedDB ||
  //   window.mozIndexedDB ||
  //   window.webkitIndexedDB

  // const openRequest = indexedDB.open('downloadDB', 1)

  // openRequest.onsuccess = event => {
  //   const db = event.target.result
  //   const transaction = db.transaction(['chunks'], 'readwrite')
  //   const objectStore = transaction.objectStore('chunks')
  //   const clearRequest = objectStore.clear()

  //   clearRequest.onsuccess = () => {
  //     console.log('IndexedDB data cleared.')
  //   }

  //   clearRequest.onerror = () => {
  //     console.error('Error clearing IndexedDB data.')
  //   }
  // }

  // openRequest.onerror = () => {
  //   console.error('Error opening IndexedDB.')
  // }
}
