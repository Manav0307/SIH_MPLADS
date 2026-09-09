import React from 'react'

interface ProjectsTableSkeletonProps {
  rowCount?: number
  density?: 'standard' | 'dense'
}

export const ProjectsTableSkeleton: React.FC<ProjectsTableSkeletonProps> = ({
  rowCount = 10,
  density = 'standard',
}) => {
  const rowHeightClass = density === 'dense' ? 'h-7' : 'h-10'

  return (
    <div className="w-full animate-pulse">
      {Array.from({ length: rowCount }).map((_, idx) => (
        <div
          key={idx}
          className={`flex items-center gap-3 border-b border-[#161F36] px-3 ${rowHeightClass} bg-[#10182B]`}
        >
          <div className="w-14 h-4 bg-[#161F36] rounded" />
          <div className="w-8 h-4 bg-[#161F36] rounded" />
          <div className="w-28 h-4 bg-[#161F36] rounded" />
          <div className="w-56 h-4 bg-[#161F36] rounded flex-1" />
          <div className="w-20 h-4 bg-[#161F36] rounded" />
          <div className="w-24 h-4 bg-[#161F36] rounded" />
          <div className="w-20 h-4 bg-[#161F36] rounded" />
          <div className="w-24 h-4 bg-[#161F36] rounded" />
          <div className="w-24 h-4 bg-[#161F36] rounded" />
          <div className="w-16 h-4 bg-[#161F36] rounded" />
          <div className="w-20 h-4 bg-[#161F36] rounded" />
        </div>
      ))}
    </div>
  )
}
