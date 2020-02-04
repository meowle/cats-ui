import React from 'react'
import { CatsApi } from '../../api/cats'

function App() {
  const text = CatsApi.getAll()

  return <div>Hello, {text}</div>
}

export default App
