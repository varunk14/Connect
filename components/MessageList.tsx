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
    <div className="h-full overflow-y-auto bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center animate-fade-in">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-500 text-xl font-medium">No messages yet</p>
            <p className="text-gray-400 text-sm mt-2">Start the conversation! 👋</p>
          </div>
        </div>
      ) : (
        messages.map((msg, index) => {
          const isCurrentUser = msg.username === currentUser
          const isSystem = msg.username === 'System'
          
          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center animate-slide-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="glass px-5 py-2 rounded-full text-sm text-gray-600 font-medium shadow-sm">
                  {msg.message}
                </div>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`flex items-end gap-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-5 py-3 rounded-3xl shadow-lg transition-all hover:shadow-xl ${
                    isCurrentUser
                      ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                  }`}
                >
                  {!isCurrentUser && (
                    <div className="text-xs font-bold mb-1.5 text-indigo-600">
                      {msg.username}
                    </div>
                  )}
                  <div className={`text-sm break-words leading-relaxed ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                    {msg.message}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      isCurrentUser ? 'text-white/80' : 'text-gray-400'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

