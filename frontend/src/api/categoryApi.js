import {
  collection, getDocs, addDoc, deleteDoc, updateDoc,
  doc, serverTimestamp, query, orderBy
} from 'firebase/firestore'
import { db } from '../firebase'

const col     = (uid) => collection(db, 'users', uid, 'categories')
const catDoc  = (uid, id) => doc(db, 'users', uid, 'categories', id)
const toCat   = d => ({ id: d.id, ...d.data() })

export const getCategories = async (uid) => {
  const snap = await getDocs(query(col(uid), orderBy('createdAt', 'asc')))
  return snap.docs.map(toCat)
}

export const createCategory = (uid, name) =>
  addDoc(col(uid), { name, createdAt: serverTimestamp() })

export const deleteCategory = (uid, id) =>
  deleteDoc(catDoc(uid, id))

export const renameCategory = (uid, id, name) =>
  updateDoc(catDoc(uid, id), { name })
