import { useState, useEffect } from 'react'

let toastFn = null
export const toast = {
  success: (msg) => toastFn?.('success', msg),
  error: (msg) => toastFn?.('error', msg),
  info: (msg) => toastFn?.('info', msg),
}

const icons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
}
const colors = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
}

const ToastContainer = () => {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    toastFn = (type, message) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, type, message }])
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-md text-sm animate-fade-in ${colors[t.type]}`}>
          <span>{icons[t.type]}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

export default ToastContainer
