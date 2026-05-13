/**
 * Chat Page
 * Main page component cho chat feature
 * Hiển thị ChatWindow component
 */

import { useAuthStore } from '@/stores/auth.store'
import { ChatWindow } from '../components/ChatWindow'

export default function ChatPage() {
  const currentUser = useAuthStore((s) => s.user)

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="h-full">
      <ChatWindow currentUserId={currentUser.id} />
    </div>
  )
}
