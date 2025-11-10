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
    <div className="glass border-t border-gray-200/50 p-3 md:p-6 backdrop-blur-xl">
      <form onSubmit={handleSubmit} className="flex gap-2 md:gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={disabled ? 'Connecting...' : 'Type your message...'}
            disabled={disabled}
            rows={1}
            className="w-full px-3 md:px-5 py-2.5 md:py-4 bg-white/90 border-2 border-gray-200 rounded-xl md:rounded-2xl focus:outline-none focus:border-indigo-400 focus:ring-2 md:focus:ring-4 focus:ring-indigo-100 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md text-sm md:text-base text-gray-800 placeholder-gray-400"
            style={{ minHeight: '44px', maxHeight: '120px' }}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="px-4 md:px-8 py-2.5 md:py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl md:rounded-2xl font-semibold hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-1.5 md:gap-2 min-w-[70px] md:min-w-[100px] justify-center text-sm md:text-base"
        >
          {disabled ? (
            <span className="hidden sm:inline">Wait...</span>
          ) : (
            <>
              <span className="hidden sm:inline">Send</span>
              <svg
                className="w-4 h-4 md:w-5 md:h-5"
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

