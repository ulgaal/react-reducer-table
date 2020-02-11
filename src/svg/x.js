import React from 'react'

const icon = props => {
  const { width = 16, height = 16 } = props
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='18' y1='6' x2='6' y2='18' />
      <line x1='6' y1='6' x2='18' y2='18' />
    </svg>
  )
}

const areEqual = (prev, next) =>
  prev.width === next.width && prev.height === next.height

export default React.memo(icon, areEqual)
