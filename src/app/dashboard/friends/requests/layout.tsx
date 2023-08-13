import React from 'react'

interface Props {
  children: React.ReactNode;
}

function FriendRequestsLayout({ children }: Props) {
  return (
    <main className="pt-8">
      <h1 className="text-5xl font-bold mb-8">Incoming friend requests</h1>
      {children}
    </main>
  )
}

export default FriendRequestsLayout