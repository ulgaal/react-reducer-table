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
import { ScrollerDispatch, HSCROLL } from './scrollerReducer'
import './HScroller.css'

const margin = 6

const HScroller = props => {
  // console.log('Scroller', props)
  const {
    state: { scrolling, scrollLeft, scrollableBody }
  } = props
  const scrollerDispatch = useContext(ScrollerDispatch)

  let section = null
  let sectionWidth = 0
  let bodyWidth = 0
  let tableWidth = 0
  if (scrollableBody) {
    section = scrollableBody.closest('.rrt-section')
    sectionWidth = section.getBoundingClientRect().width
    bodyWidth = scrollableBody.getBoundingClientRect().width
    tableWidth = section.closest('.rrt-table').getBoundingClientRect().width
  }
  const visible = bodyWidth > sectionWidth
  const scrollerWidth = tableWidth - 2 * margin
  const thumbWidth = bodyWidth ? (scrollerWidth * sectionWidth) / bodyWidth : 0
  const marginLeft = margin + scrollLeft

  const handleMouseDown = useCallback(
    event => {
      const left0 = scrollLeft
      const x0 = event.clientX
      event.stopPropagation()
      event.preventDefault()
      const handlers = {}
      // Position mouse handlers to create a modal drag loop
      handlers.handleMouseMove = event => {
        event.preventDefault()
        event.stopPropagation()
        const dx = event.clientX - x0
        const left1 = Math.min(
          Math.max(0, left0 + dx),
          scrollerWidth - thumbWidth
        )
        scrollerDispatch({
          type: HSCROLL,
          scrolling: true,
          scrollLeft: left1
        })
        const newLeft = (left1 * bodyWidth) / scrollerWidth
        section.scrollLeft = newLeft
      }
      handlers.handleMouseUp = event => {
        event.preventDefault()
        event.stopPropagation()
        window.removeEventListener('mousemove', handlers.handleMouseMove, true)
        scrollerDispatch({
          type: HSCROLL,
          scrolling: false
        })
      }
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [
      scrollerDispatch,
      scrollLeft,
      section,
      bodyWidth,
      scrollerWidth,
      thumbWidth
    ]
  )
  return visible ? (
    <div className='rrt-hscroller' onMouseDown={handleMouseDown}>
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

export default HScroller
