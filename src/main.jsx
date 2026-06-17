// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import Showcase from './showcase/Showcase'

// Basic layout adjustments for demo showcase
const style = document.createElement('style')
style.textContent = `
  body {
    margin: 0;
    padding: 0;
    background-color: #0a0a0a;
    overflow-x: hidden;
  }
`
document.head.appendChild(style)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Showcase />
  </React.StrictMode>,
)
