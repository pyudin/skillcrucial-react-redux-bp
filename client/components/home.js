import React, { useState } from 'react'
import Dashboard from './dashboard'
import Head from './head'
import Main from './main'
// import wave from '../assets/images/wave.jpg'

const Home = () => {
  const [counter, setCounterNew] = useState(0)

  return (
    <div>
      <Head title="Hello" />
      <img alt="waves" src="images/wave.jpg" />
      <button type="button" onClick={() => setCounterNew(counter + 1)}>
        updateCounter
      </button>
      <div> Hello World Dashboard {counter} </div>
      <Dashboard />
      <Main />
    </div>
  )
}

Home.propTypes = {}

export default Home
