'use client'

import { useEffect, useState, useRef } from 'react'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import UserList from './UserList'
import {
  subscribeToMessages,
  subscribeToUsers,
  sendMessage as sendMessageToFirestore,
  setUserOnline,
  setUserOffline,
  Message,
} from '@/lib/firestore'

interface ChatInterfaceProps {
  username: string
}

export default function ChatInterface({ username }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<string[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const previousUsersRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    // Set user as online
    setUserOnline(username)
    setIsConnected(true)

    // Subscribe to messages
    const unsubscribeMessages = subscribeToMessages((newMessages) => {
      setMessages(newMessages)
    })

    // Subscribe to users
    const unsubscribeUsers = subscribeToUsers((userList) => {
      const currentUsers = new Set(userList)
      const previousUsers = previousUsersRef.current

      // Detect new users joining
      userList.forEach((user) => {
        if (!previousUsers.has(user) && user !== username) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-join-${user}-${Date.now()}`,
              username: 'System',
              message: `${user} joined the chat`,
              timestamp: Date.now(),
            },
          ])
        }
      })

      // Detect users leaving
      previousUsers.forEach((user) => {
        if (!currentUsers.has(user) && user !== username) {
          setMessages((prev) => [
            ...prev,
            {
              id: `system-left-${user}-${Date.now()}`,
              username: 'System',
              message: `${user} left the chat`,
              timestamp: Date.now(),
            },
          ])
        }
      })

      previousUsersRef.current = currentUsers
      setUsers(userList)
    })

    // Cleanup on unmount
    return () => {
      unsubscribeMessages()
      unsubscribeUsers()
      setUserOffline(username)
      setIsConnected(false)
    }
  }, [username])

  // Handle page visibility change (set offline when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setUserOffline(username)
      } else {
        setUserOnline(username)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Handle beforeunload (when user closes tab/window)
    const handleBeforeUnload = () => {
      setUserOffline(username)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [username])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (message: string) => {
    if (message.trim() && isConnected) {
      try {
        await sendMessageToFirestore(username, message)
      } catch (error) {
        console.error('Error sending message:', error)
        alert('Failed to send message. Please try again.')
      }
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar with user list */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary-500 to-primary-600">
          <h1 className="text-xl font-bold text-white">Chat App 💬</h1>
          <div className="flex items-center mt-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-sm text-white/90">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
        <UserList users={users} currentUser={username} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MessageList messages={messages} currentUser={username} />
          <div ref={messagesEndRef} />
        </div>
        <MessageInput onSendMessage={sendMessage} disabled={!isConnected} />
      </div>
    </div>
  )
}

