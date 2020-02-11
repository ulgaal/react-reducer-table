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
      <polygon points='13 19 22 12 13 5 13 19' />
      <polygon points='2 19 11 12 2 5 2 19' />
    </svg>
  )
}

const areEqual = (prev, next) =>
  prev.width === next.width && prev.height === next.height

export default React.memo(icon, areEqual)
