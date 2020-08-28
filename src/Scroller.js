import React, { useContext, useRef, useEffect, useCallback } from 'react'
import { ScrollerDispatch, RESIZE, SCROLL } from './Data'
import './Scroller.css'

const margin = 6

const Scroller = props => {
  // console.log('Scroller', props)
  const {
    scrolling,
    scrollerHeight,
    scrollTop,
    scrollableBody,
    fixedBody
  } = props
  const scrollerDispatch = useContext(ScrollerDispatch)

  // Measure the scrollbar
  const ref = useRef(null)
  useEffect(() => {
    const current = ref.current
    if (current) {
      const { height } = current.getBoundingClientRect()
      if (height !== scrollerHeight) {
        scrollerDispatch({ type: RESIZE, scrollerHeight: height })
      }
    }
  })
  let bodyHeight = 0
  let rowsHeight = 0
  if (scrollableBody) {
    bodyHeight = scrollableBody.getBoundingClientRect().height
    rowsHeight = scrollableBody.firstChild.getBoundingClientRect().height
  }

  const visible = rowsHeight > bodyHeight
  const barTop = scrollerHeight - bodyHeight - 1
  const scrollerHeight_ = bodyHeight - 2 * margin
  const thumbHeight = rowsHeight
    ? (scrollerHeight_ * bodyHeight) / rowsHeight
    : 0
  const marginTop = margin + scrollTop

  const handleMouseDown = useCallback(
    event => {
      const top0 = scrollTop
      const y0 = event.clientY
      event.stopPropagation()
      event.preventDefault()
      const handlers = {}
      // Position mouse handlers to create a modal drag loop
      handlers.handleMouseMove = event => {
        event.preventDefault()
        event.stopPropagation()
        const dy = event.clientY - y0
        const top1 = Math.min(
          Math.max(0, top0 + dy),
          scrollerHeight_ - thumbHeight
        )
        scrollerDispatch({
          type: SCROLL,
          scrolling: true,
          scrollTop: top1
        })
        const newTop = (top1 * rowsHeight) / scrollerHeight_
        console.log('NEWTOP', newTop)
        fixedBody.scrollTop = newTop
        scrollableBody.scrollTop = newTop
      }
      handlers.handleMouseUp = event => {
        event.preventDefault()
        event.stopPropagation()
        window.removeEventListener('mousemove', handlers.handleMouseMove, true)
        scrollerDispatch({
          type: SCROLL,
          scrolling: false
        })
      }
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [
      scrollerDispatch,
      scrollTop,
      scrollableBody,
      fixedBody,
      rowsHeight,
      scrollerHeight_,
      thumbHeight
    ]
  )
  return visible ? (
    <div className='rrt-vscroller' ref={ref} onMouseDown={handleMouseDown}>
      <div
        className='rrt-vscroller-bar'
        style={{ height: `${bodyHeight}px`, marginTop: `${barTop}px` }}
      >
        <div
          className={`rrt-vscroller-thumb${
            scrolling ? ' rrt-vscroller-thumb-active' : ''
          }`}
          style={{
            height: `${thumbHeight}px`,
            top: `${marginTop}px`
          }}
        />
      </div>
    </div>
  ) : null
}

export default Scroller
