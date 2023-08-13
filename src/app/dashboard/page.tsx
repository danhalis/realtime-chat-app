import React from 'react'

async function DashboardPage() {
  await new Promise(r => setTimeout(r, 2000));
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage