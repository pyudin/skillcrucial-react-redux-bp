import React from 'react'
import { Link } from 'react-router-dom'

function Main() {
  return (
    <div>
      <div id="title">Main</div>
      <Link to="/dashboard/profile/9014abd2-0916-4eab-adc0-f65959f79224">Go To Profile</Link>
      <Link to="/dashboard">Go To Root</Link>
    </div>
  )
}

export default Main
