'use client'

interface UserListProps {
  users: string[]
  currentUser: string
}

export default function UserList({ users, currentUser }: UserListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
        Online Users ({users.length})
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user}
            className={`flex items-center p-2 rounded-lg ${
              user === currentUser
                ? 'bg-primary-100 text-primary-700 font-semibold'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm">{user}</span>
            {user === currentUser && (
              <span className="ml-auto text-xs text-primary-600">(You)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

