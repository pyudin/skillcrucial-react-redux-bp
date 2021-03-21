import React from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div>
      <div id="title">Dashboard</div>
      <Link to="/dashboard/profile/9014abd2-0916-4eab-adc0-f65959f79224">Go To Profile</Link>
      <Link to="/dashboard/main">Go To Main</Link>
    </div>
  )
}

export default Dashboard
