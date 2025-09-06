'use client'

import { ArrowLeft, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Breadcrumb from './Breadcrumb'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
  current?: boolean
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  onBack?: () => void
  customActions?: React.ReactNode
  breadcrumbs?: BreadcrumbItem[]
}

export default function PageHeader({ 
  title, 
  subtitle, 
  icon, 
  showBackButton = true, 
  showHomeButton = true,
  onBack,
  customActions,
  breadcrumbs
}: PageHeaderProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleHome = () => {
    router.push('/dashboard')
  }

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-30">
      <div className="mobile-container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2">
              {showBackButton && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-button"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              {showHomeButton && (
                <button
                  onClick={handleHome}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-button"
                  title="Go to Dashboard"
                >
                  <Home className="w-5 h-5 text-primary-600" />
                </button>
              )}
            </div>

            {/* Title Section */}
            <div className="flex items-center space-x-3">
              {icon && <span className="text-2xl">{icon}</span>}
              <div>
                <h1 className="mobile-heading font-bold text-gray-800">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 hidden sm:block">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Custom Actions */}
          {customActions && (
            <div className="flex items-center space-x-2">
              {customActions}
            </div>
          )}
        </div>

        {/* Mobile Subtitle */}
        {subtitle && (
          <p className="text-sm text-gray-600 mt-2 sm:hidden">{subtitle}</p>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="mt-3 sm:mt-2">
            <Breadcrumb items={breadcrumbs} />
          </div>
        )}
      </div>
    </div>
  )
}