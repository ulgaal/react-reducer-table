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
      <polygon points='5 4 15 12 5 20 5 4' />
      <line x1='19' y1='5' x2='19' y2='19' />
    </svg>
  )
}

const areEqual = (prev, next) =>
  prev.width === next.width && prev.height === next.height

export default React.memo(icon, areEqual)
