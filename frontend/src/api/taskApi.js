import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'tasks'

const toTask = d => ({ id: d.id, ...d.data() })

export const getAllTasks = async () => {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')))
  return snap.docs.map(toTask)
}

export const createTask = (data) =>
  addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })

export const updateTask = (id, data) =>
  updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() })

export const patchStatus = (id, status) =>
  updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() })

export const deleteTask = (id) =>
  deleteDoc(doc(db, COL, id))
