'use client'

import { ExternalLink, Github, Play, Smartphone, Monitor, Gamepad2 } from 'lucide-react'

export default function TryItOutSection() {
  const deploymentOptions = [
    {
      name: 'Live Demo',
      description: 'Try the full app instantly',
      url: 'https://focusquest.vercel.app',
      icon: <Play className="w-6 h-6" />,
      primary: true,
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      name: 'GitHub',
      description: 'View source code & fork',
      url: 'https://github.com/yourusername/focusquest',
      icon: <Github className="w-6 h-6" />,
      color: 'bg-gray-800 hover:bg-gray-900'
    },
    {
      name: 'Deploy on Vercel',
      description: 'One-click deployment',
      url: 'https://vercel.com/new/clone?repository-url=https://github.com/yourusername/focusquest',
      icon: <ExternalLink className="w-6 h-6" />,
      color: 'bg-black hover:bg-gray-800'
    },
    {
      name: 'Deploy on Netlify',
      description: 'Alternative hosting',
      url: 'https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/focusquest',
      icon: <ExternalLink className="w-6 h-6" />,
      color: 'bg-teal-600 hover:bg-teal-700'
    }
  ]

  const features = [
    {
      icon: <Monitor className="w-8 h-8 text-blue-600" />,
      title: 'Desktop Optimized',
      description: 'Full-featured experience on desktop browsers'
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-600" />,
      title: 'Mobile Ready',
      description: 'Responsive design works perfectly on mobile'
    },
    {
      icon: <Gamepad2 className="w-8 h-8 text-purple-600" />,
      title: '8+ Mini-Games',
      description: 'From RPG battles to rhythm games'
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Try FocusQuest Now!
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of gamified productivity. Level up your tasks, 
            compete with friends, and turn your daily routine into an epic adventure!
          </p>
        </div>

        {/* Deployment Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {deploymentOptions.map((option, index) => (
            <a
              key={index}
              href={option.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${option.color} ${
                option.primary ? 'md:col-span-2 lg:col-span-1' : ''
              } text-white rounded-xl p-6 transition-all duration-200 transform hover:scale-105 hover:shadow-lg group`}
            >
              <div className="flex items-center space-x-3 mb-3">
                {option.icon}
                <h3 className="text-lg font-semibold">{option.name}</h3>
              </div>
              <p className="text-sm opacity-90">{option.description}</p>
              <div className="mt-4 flex items-center text-sm opacity-75 group-hover:opacity-100">
                <span>Get started</span>
                <ExternalLink className="w-4 h-4 ml-2" />
              </div>
            </a>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ⚡ 5-Minute Quick Start
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: '1', action: 'Visit Demo', desc: 'Click the Live Demo button above' },
              { step: '2', action: 'Create Task', desc: 'Add your first productivity task' },
              { step: '3', action: 'Start Focus', desc: 'Begin a 25-minute focus session' },
              { step: '4', action: 'Play Game', desc: 'Try a mini-game during your break' },
              { step: '5', action: 'Level Up', desc: 'Watch your character progress!' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.action}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Local Development */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 text-center">
            🛠️ Run Locally
          </h3>
          <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="text-green-400"># Clone and run FocusQuest locally</div>
            <div className="mt-2">git clone https://github.com/yourusername/focusquest.git</div>
            <div>cd focusquest</div>
            <div>npm install</div>
            <div>npm run dev</div>
            <div className="text-blue-400 mt-2"># Open http://localhost:3000</div>
          </div>
          <p className="text-gray-300 text-center mt-4">
            Perfect for customization and contributing to the project!
          </p>
        </div>
      </div>
    </section>
  )
}