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
import React, { useContext, useCallback } from 'react'
import { ScrollerStateType } from './prop-types'
import { ScrollerDispatch, HSCROLL } from './reducers/scrollerReducer'
import { log } from './utils'
import './HScroller.css'

const margin = 6

const HScroller = props => {
  log('HScroller', 0, props)
  const {
    state: { scrolling, scrollLeft, scrollableBody }
  } = props
  const scrollerDispatch = useContext(ScrollerDispatch)

  let section = null
  let sectionWidth = 0
  let bodyWidth = 0
  let tableWidth = 0
  if (scrollableBody && scrollableBody.isConnected) {
    // scrollableBody may be temporarily detached
    // if one hides all previously fixed columns
    section = scrollableBody.closest('.rrt-section')
    sectionWidth = section.getBoundingClientRect().width
    bodyWidth = scrollableBody.getBoundingClientRect().width
    tableWidth = section.closest('.rrt-table').getBoundingClientRect().width
  }
  const visible = bodyWidth > sectionWidth
  const scrollerWidth = tableWidth - 2 * margin
  const thumbWidth = bodyWidth ? (scrollerWidth * sectionWidth) / bodyWidth : 0
  const scrollLeftMax = scrollerWidth - thumbWidth
  const marginLeft = margin + scrollLeft

  const scrollSection = useCallback(
    left => {
      const newLeft = (left * bodyWidth) / scrollerWidth
      section.scrollLeft = newLeft
      scrollerDispatch({
        type: HSCROLL,
        scrolling: true,
        scrollLeft: left
      })
    },
    [section, bodyWidth, scrollerWidth, scrollerDispatch]
  )

  const handleMouseDown = useCallback(
    event => {
      event.stopPropagation()
      event.preventDefault()
      const x0 = event.clientX
      const inThumb = event.target.closest('.rrt-hscroller-thumb') !== null
      let left0 = scrollLeft
      if (!inThumb) {
        const { left } = event.target
          .closest('.rrt-hscroller')
          .getBoundingClientRect()
        left0 = Math.min(x0 - left, scrollLeftMax)
        scrollSection(left0)
      }
      const handlers = {}
      // Position mouse handlers to create a modal drag loop
      handlers.handleMouseMove = event => {
        event.preventDefault()
        event.stopPropagation()
        const dx = event.clientX - x0
        const left1 = Math.min(Math.max(0, left0 + dx), scrollLeftMax)
        scrollSection(left1)
      }
      handlers.handleMouseUp = event => {
        event.preventDefault()
        event.stopPropagation()
        window.removeEventListener('mousemove', handlers.handleMouseMove, true)
        window.removeEventListener('mouseup', handlers.handleMouseUp, true)
        scrollerDispatch({
          type: HSCROLL,
          scrolling: false
        })
      }
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [scrollerDispatch, scrollLeft, scrollLeftMax, scrollSection]
  )

  const handleWheel = useCallback(
    event => {
      event.stopPropagation()
      // Cannot prevent default due to react not supporting passive events yet
      // event.preventDefault()
      const { deltaY } = event
      const left = Math.min(
        Math.max(0, scrollLeft + Math.sign(deltaY) * 30),
        scrollLeftMax
      )
      scrollSection(left)
    },
    [scrollSection, scrollLeft, scrollLeftMax]
  )

  return visible ? (
    <div
      className='rrt-hscroller'
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
    >
      <div
        className={`rrt-hscroller-thumb${
          scrolling ? ' rrt-hscroller-thumb-active' : ''
        }`}
        style={{
          width: `${thumbWidth}px`,
          left: `${marginLeft}px`
        }}
      />
    </div>
  ) : null
}

HScroller.propTypes = {
  state: ScrollerStateType
}

HScroller.displayName = 'HScroller'

export default HScroller
