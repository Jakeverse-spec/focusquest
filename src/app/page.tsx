export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          Welcome to <span className="text-blue-600">FocusQuest</span>
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Transform your daily tasks into epic adventures
        </p>
        <a 
          href="/dashboard" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-colors"
        >
          Start Your Adventure
        </a>
      </div>
    </div>
  )
}