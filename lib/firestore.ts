import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  where,
} from 'firebase/firestore'
import { db } from './firebase'

export interface Message {
  id: string
  username: string
  message: string
  timestamp: number
}

export interface UserPresence {
  username: string
  lastSeen: Timestamp
  isOnline: boolean
}

const MESSAGES_COLLECTION = 'messages'
const USERS_COLLECTION = 'activeUsers'
const MAX_MESSAGES = 100

// Messages
export const subscribeToMessages = (
  callback: (messages: Message[]) => void
): (() => void) => {
  const q = query(
    collection(db, MESSAGES_COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(MAX_MESSAGES)
  )

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        username: data.username,
        message: data.message,
        timestamp: data.timestamp?.toMillis() || Date.now(),
      })
    })
    // Reverse to show oldest first
    callback(messages.reverse())
  })
}

export const sendMessage = async (
  username: string,
  message: string
): Promise<void> => {
  try {
    await addDoc(collection(db, MESSAGES_COLLECTION), {
      username,
      message: message.trim(),
      timestamp: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

// User Presence
export const setUserOnline = async (username: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, username)
    await setDoc(
      userRef,
      {
        username,
        lastSeen: serverTimestamp(),
        isOnline: true,
      },
      { merge: true }
    )
  } catch (error) {
    console.error('Error setting user online:', error)
    throw error
  }
}

export const setUserOffline = async (username: string): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, username)
    await setDoc(
      userRef,
      {
        username,
        lastSeen: serverTimestamp(),
        isOnline: false,
      },
      { merge: true }
    )
  } catch (error) {
    console.error('Error setting user offline:', error)
    throw error
  }
}

export const subscribeToUsers = (
  callback: (users: string[]) => void
): (() => void) => {
  const q = query(
    collection(db, USERS_COLLECTION),
    where('isOnline', '==', true)
  )

  return onSnapshot(q, (snapshot) => {
    const users: string[] = []
    snapshot.forEach((doc) => {
      const data = doc.data()
      if (data.username && data.isOnline) {
        users.push(data.username)
      }
    })
    callback(users)
  })
}

// Cleanup old messages (optional - can be done via Cloud Functions)
export const cleanupOldMessages = async (): Promise<void> => {
  try {
    const q = query(
      collection(db, MESSAGES_COLLECTION),
      orderBy('timestamp', 'desc')
    )
    const snapshot = await getDocs(q)
    
    if (snapshot.size > MAX_MESSAGES) {
      const messagesToDelete = snapshot.docs.slice(MAX_MESSAGES)
      const deletePromises = messagesToDelete.map((doc) => deleteDoc(doc.ref))
      await Promise.all(deletePromises)
    }
  } catch (error) {
    console.error('Error cleaning up messages:', error)
  }
}

