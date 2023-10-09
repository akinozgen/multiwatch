import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import YoutubeGrid from './components/YoutubeGrid'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <YoutubeGrid  />
    </>
  )
}

export default App
