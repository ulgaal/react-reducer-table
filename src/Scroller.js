/*
Copyright 2020 Ulrich Gaal

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
  if (fixedBody) {
    bodyHeight = fixedBody.getBoundingClientRect().height
    rowsHeight = fixedBody.firstChild.getBoundingClientRect().height
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
