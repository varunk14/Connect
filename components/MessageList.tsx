'use client'

interface Message {
  id: string
  username: string
  message: string
  timestamp: number
}

interface MessageListProps {
  messages: Message[]
  currentUser: string
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-400 text-lg">No messages yet. Start the conversation! 👋</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isCurrentUser = msg.username === currentUser
          const isSystem = msg.username === 'System'
          
          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-full text-sm">
                  {msg.message}
                </div>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                {!isCurrentUser && (
                  <div className="text-xs font-semibold mb-1 opacity-80">
                    {msg.username}
                  </div>
                )}
                <div className="text-sm break-words">{msg.message}</div>
                <div
                  className={`text-xs mt-1 ${
                    isCurrentUser ? 'text-white/70' : 'text-gray-500'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

