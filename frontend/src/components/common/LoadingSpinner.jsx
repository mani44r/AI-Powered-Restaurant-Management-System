const LoadingSpinner = ({ message = 'Loading...', fullPage = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-14 w-14 border-4',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`animate-spin rounded-full border-orange-500 border-t-transparent ${sizes[size]}`}></div>
      {message && <p className="text-gray-500 text-sm">{message}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      {spinner}
    </div>
  )
}

export default LoadingSpinner
