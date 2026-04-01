const LoadingSpinner = ({ message = 'Loading...', fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent mb-3"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}

export default LoadingSpinner
