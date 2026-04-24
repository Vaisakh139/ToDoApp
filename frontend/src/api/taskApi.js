import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";

const toTask = (d) => ({ id: d.id, ...d.data() });
const col = (uid) => collection(db, "users", uid, "tasks");
const taskDoc = (uid, id) => doc(db, "users", uid, "tasks", id);

export const getAllTasks = async (uid) => {
  const snap = await getDocs(query(col(uid), orderBy("createdAt", "desc")));
  return snap.docs.map(toTask);
};

export const createTask = async (uid, data) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", uid, "tasks"), // user-specific tasks
      {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
    );

    return docRef.id;
  } catch (err) {
    console.error("Error creating task:", err);
    throw err;
  }
};

export const updateTask = (uid, id, data) =>
  updateDoc(taskDoc(uid, id), { ...data, updatedAt: serverTimestamp() });

export const patchStatus = (uid, id, status) =>
  updateDoc(taskDoc(uid, id), { status, updatedAt: serverTimestamp() });

export const deleteTask = (uid, id) => deleteDoc(taskDoc(uid, id));

export const updateSubtasks = (uid, id, subtasks) =>
  updateDoc(taskDoc(uid, id), { subtasks, updatedAt: serverTimestamp() });

export const deleteTasksByCategory = async (uid, categoryId) => {
  const snap = await getDocs(query(col(uid), where('categoryId', '==', categoryId)))
  if (snap.empty) return
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.delete(d.ref))
  await batch.commit()
}
