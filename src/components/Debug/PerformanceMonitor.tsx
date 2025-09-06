'use client'

import { useEffect, useState, memo } from 'react'

interface PerformanceMetrics {
  renderCount: number
  lastRenderTime: number
  averageRenderTime: number
  memoryUsage?: number
}

interface PerformanceMonitorProps {
  componentName: string
  enabled?: boolean
}

const PerformanceMonitor = memo(function PerformanceMonitor({ 
  componentName, 
  enabled = process.env.NODE_ENV === 'development' 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  })
  
  useEffect(() => {
    if (!enabled) return
    
    const startTime = performance.now()
    
    setMetrics(prev => {
      const renderTime = performance.now() - startTime
      const newRenderCount = prev.renderCount + 1
      const newAverageRenderTime = (prev.averageRenderTime * prev.renderCount + renderTime) / newRenderCount
      
      return {
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverageRenderTime,
        memoryUsage: (performance as any).memory?.usedJSHeapSize
      }
    })
  })
  
  if (!enabled) return null
  
  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white text-xs p-2 rounded font-mono z-50">
      <div className="font-bold">{componentName}</div>
      <div>Renders: {metrics.renderCount}</div>
      <div>Last: {metrics.lastRenderTime.toFixed(2)}ms</div>
      <div>Avg: {metrics.averageRenderTime.toFixed(2)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB</div>
      )}
    </div>
  )
})

export default PerformanceMonitor