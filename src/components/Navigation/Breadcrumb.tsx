'use client'

import { ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`} aria-label="Breadcrumb">
      <Link 
        href="/dashboard" 
        className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
      >
        <Home className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.href && !item.current ? (
            <Link 
              href={item.href}
              className="flex items-center space-x-1 text-gray-500 hover:text-primary-600 transition-colors"
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className={`flex items-center space-x-1 ${
              item.current ? 'text-primary-600 font-medium' : 'text-gray-500'
            }`}>
              {item.icon && <span>{item.icon}</span>}
              <span>{item.label}</span>
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}