export default function SimplePage() {
  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          FocusQuest
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Simple test page - your app is working!
        </p>
        <a 
          href="/dashboard" 
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  )
}