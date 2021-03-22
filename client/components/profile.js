import React from 'react'
import { Link, useParams } from 'react-router-dom'

function Profile() {
  const { user } = useParams()

  return (
    <div>
      <div id="title">Profile</div>
      <Link to="/dashboard">Go To Root</Link>
      <Link to="/dashboard/main">Go To Main</Link>
      <div id="username">{user}</div>
    </div>
  )
}

export default Profile
