import React from 'react'
import './TextSizer.css'

const TextSizer = props => {
  // console.log('TextSizer', props)
  const { labels } = props
  return (
    <div className='text-sizer'>
      {labels.map((label, index) => (
        <div key={index}>{label}</div>
      ))}
    </div>
  )
}
export const areEqual = (prev, next) => {
  return prev.labels === next.labels
}

export default React.memo(TextSizer, areEqual)
