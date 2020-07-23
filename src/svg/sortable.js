import React from 'react'

const icon = props => {
  const { width = 16, height = 16 } = props
  return (
    <svg
      width={`${width}px`}
      height={`${height}px`}
      viewBox='0 0 24 24'
      style={{
        fill: 'none',
        stroke: '#ccc',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeDasharray: '1 1'
      }}
    >
      <line x1='12' y1='19' x2='12' y2='5' />
      <polyline points='7 10 12 5 17 10' />
      <polyline points='17 14 12 19 7 14' />
    </svg>
  )
}

const areEqual = (prev, next) =>
  prev.width === next.width && prev.height === next.height

export default React.memo(icon, areEqual)
