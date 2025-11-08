'use client'

interface UserListProps {
  users: string[]
  currentUser: string
}

export default function UserList({ users, currentUser }: UserListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-4 px-2">
        Online Users ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={user}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 animate-slide-in ${
              user === currentUser
                ? 'bg-white/20 backdrop-blur-sm border-2 border-white/30 shadow-lg'
                : 'bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 hover:shadow-md backdrop-blur-sm'
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${
                user === currentUser ? 'bg-green-300' : 'bg-green-400'
              } shadow-lg`}>
                <div className={`absolute inset-0 rounded-full animate-pulse ${
                  user === currentUser ? 'bg-green-300' : 'bg-green-400'
                }`}></div>
              </div>
            </div>
            <span className={`text-sm font-medium flex-1 ${
              user === currentUser
                ? 'text-white font-bold'
                : 'text-white/90'
            }`}>
              {user}
            </span>
            {user === currentUser && (
              <span className="text-xs font-bold text-purple-900 bg-white/90 px-2 py-0.5 rounded-full shadow-sm">
                You
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

