import React from "react"

const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="max-w-6xl w-full space-y-8">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
          <div className="h-10 w-32 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg animate-pulse"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-card p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div>
                <div className="h-8 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main content area skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Student list skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-4"></div>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-card p-4 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-16 h-6 bg-gradient-to-r from-green-100 to-green-200 rounded-full"></div>
                    <div className="w-12 h-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar content skeleton */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-card p-6 space-y-4 animate-pulse">
              <div className="h-6 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading