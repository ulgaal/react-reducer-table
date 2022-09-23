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
import React, { useContext, useCallback, useEffect } from 'react'
import { ScrollerDispatch, VSCROLL } from './reducers/scrollerReducer'
import { ScrollerStateType } from './prop-types'
import { log } from './utils'
import './VScroller.css'

const margin = 6

const VScroller = props => {
  log('VScroller', 0, props)
  const {
    state: { scrolling, wheeling, scrollTop, scrollableBody, fixedBody, deltaY }
  } = props
  const scrollerDispatch = useContext(ScrollerDispatch)

  let scrollerHeight = 0
  let bodyHeight = 0
  let rowsHeight = 0
  if (fixedBody) {
    scrollerHeight = fixedBody.closest('.rrt-section').getBoundingClientRect()
      .height
    bodyHeight = fixedBody.getBoundingClientRect().height
    rowsHeight = fixedBody.firstChild.getBoundingClientRect().height
  }

  const visible = rowsHeight > bodyHeight
  const barTop = scrollerHeight - bodyHeight - 1
  const scrollerHeight_ = bodyHeight - 2 * margin
  const thumbHeight = rowsHeight
    ? (scrollerHeight_ * bodyHeight) / rowsHeight
    : 0
  const scrollTopMax = scrollerHeight_ - thumbHeight
  const marginTop = margin + scrollTop

  const scrollSections = useCallback(
    top => {
      const newTop = (top * rowsHeight) / scrollerHeight_
      fixedBody.scrollTop = newTop
      scrollableBody.scrollTop = newTop
      scrollerDispatch({
        type: VSCROLL,
        scrolling: true,
        scrollTop: top
      })
    },
    [rowsHeight, scrollerHeight_, fixedBody, scrollableBody, scrollerDispatch]
  )

  const handleMouseDown = useCallback(
    event => {
      event.stopPropagation()
      event.preventDefault()
      const y0 = event.clientY
      const inThumb = event.target.closest('.rrt-vscroller-thumb') !== null
      let top0 = scrollTop
      if (!inThumb) {
        const { top } = event.target
          .closest('.rrt-vscroller-bar')
          .getBoundingClientRect()
        top0 = Math.min(y0 - top, scrollTopMax)
        scrollSections(top0)
      }
      const handlers = {}
      // Position mouse handlers to create a modal drag loop
      handlers.handleMouseMove = event => {
        event.preventDefault()
        event.stopPropagation()
        const dy = event.clientY - y0
        const top1 = Math.min(Math.max(0, top0 + dy), scrollTopMax)
        scrollSections(top1)
      }
      handlers.handleMouseUp = event => {
        event.preventDefault()
        event.stopPropagation()
        window.removeEventListener('mousemove', handlers.handleMouseMove, true)
        window.removeEventListener('mouseup', handlers.handleMouseUp, true)
        scrollerDispatch({
          type: VSCROLL,
          scrolling: false
        })
      }
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [scrollerDispatch, scrollTop, scrollTopMax, scrollSections]
  )

  useEffect(() => {
    if (wheeling) {
      const left = Math.min(Math.max(0, scrollTop + deltaY), scrollTopMax)
      scrollSections(left)
    }
  }, [scrollTop, scrollTopMax, deltaY, wheeling, scrollSections])

  return visible ? (
    <div className='rrt-vscroller'>
      <div
        className='rrt-vscroller-bar'
        style={{ height: `${bodyHeight}px`, marginTop: `${barTop}px` }}
        onMouseDown={handleMouseDown}
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

VScroller.propTypes = {
  state: ScrollerStateType
}

export default VScroller
