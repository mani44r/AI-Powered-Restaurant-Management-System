/*
  WHY THIS FILE EXISTS:
  main.jsx is the JavaScript ENTRY POINT of the entire frontend application.

  RESPONSIBILITY:
  - Imports React and ReactDOM
  - Grabs the <div id="root"> from index.html
  - Mounts (renders) the entire React app tree into that div
  - Imports global CSS

  HOW IT WORKS:
  index.html has: <div id="root"></div>
  main.jsx takes that div and fills it with our React components.
  After this, React controls everything inside #root.

  INTERVIEW QUESTION:
  Q: What does ReactDOM.createRoot() do?
  A: It creates a React "root" — a controlled DOM node where React can 
     render and manage its virtual DOM. The .render() call tells React 
     what component tree to display inside that root.
*/

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/*
      StrictMode is a development tool. It does NOT affect production.
      It helps detect potential problems by intentionally double-rendering
      components so you catch side effects early.
    */}
    <App />
  </StrictMode>,
)
