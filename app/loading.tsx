export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-8">
          <div className="relative w-16 h-16 mx-auto">
            {/* Outer ring */}
            <div className="absolute inset-0 border-2 border-slate-200 rounded-full"></div>
            {/* Animated inner ring */}
            <div className="absolute inset-0 border-2 border-slate-900 rounded-full border-t-transparent animate-spin"></div>
            {/* Center dot */}
            <div className="absolute inset-4 bg-slate-900 rounded-full opacity-20"></div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="text-xl font-light text-slate-900">Loading</h2>
          <p className="text-slate-600 text-sm">Processing your request...</p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center space-x-1 mt-6">
          <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
