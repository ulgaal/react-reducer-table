import React from 'react'

const icon = props => {
  const { width = 16, height = 16 } = props
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='12' y1='19' x2='12' y2='5' />
      <polyline points='5 12 12 5 19 12' />
    </svg>
  )
}

const areEqual = (prev, next) =>
  prev.width === next.width && prev.height === next.height

export default React.memo(icon, areEqual)
