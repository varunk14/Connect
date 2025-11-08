'use client'

import { useState, FormEvent, KeyboardEvent } from 'react'

interface MessageInputProps {
  onSendMessage: (message: string) => void
  disabled: boolean
}

export default function MessageInput({ onSendMessage, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className="glass border-t border-gray-200/50 p-6 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Connecting...' : 'Type your message...'}
            disabled={disabled}
            rows={1}
            className="w-full px-5 py-4 bg-white/90 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-gray-800 placeholder-gray-400"
            style={{ minHeight: '56px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 min-w-[100px] justify-center"
        >
          {disabled ? (
            'Wait...'
          ) : (
            <>
              <span>Send</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
}

