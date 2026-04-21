import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase'

export async function uploadFile(uid, file, onProgress) {
  const path    = `users/${uid}/files/${Date.now()}_${file.name}`
  const fileRef = ref(storage, path)

  await new Promise((resolve, reject) => {
    const task = uploadBytesResumable(fileRef, file)
    task.on('state_changed',
      snap => onProgress && onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      resolve,
    )
  })

  const url = await getDownloadURL(fileRef)
  return { fileUrl: url, fileName: file.name, fileType: file.type, filePath: path }
}

export function deleteFile(path) {
  return deleteObject(ref(storage, path))
}
