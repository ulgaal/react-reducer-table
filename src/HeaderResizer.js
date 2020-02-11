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
import React, { createContext, useCallback, useContext } from 'react'
import { ColumnType, LayoutType } from './prop-types'
import './HeaderResizer.css'

export const START_RESIZING = 'START_RESIZING'
export const RESIZE = 'RESIZE'
export const END_RESIZING = 'END_RESIZING'
export const ResizerContext = createContext(null)

const HeaderResizer = props => {
  const {
    column,
    layout: { rule }
  } = props
  const { id, minWidth = 80 } = column
  const dispatch = useContext(ResizerContext)
  const handleMouseDown = useCallback(
    event => {
      const x0 = event.clientX
      let x1
      let clampedWidth
      event.stopPropagation()
      event.preventDefault()
      // current column width
      const { width } = event.target.closest('.rrt-th').getBoundingClientRect()
      dispatch({ type: START_RESIZING, x: x0 })
      console.log('handleMouseDown', width)
      const handlers = {
        handleMouseMove: event => {
          event.stopPropagation()
          event.preventDefault()
          const dx = event.clientX - x0
          clampedWidth = Math.max(minWidth, width + dx)
          x1 = x0 + clampedWidth - width
          dispatch({ type: RESIZE, x: x1 })
        },
        handleMouseUp: event => {
          event.stopPropagation()
          event.preventDefault()
          window.removeEventListener(
            'mousemove',
            handlers.handleMouseMove,
            true
          )
          window.removeEventListener('mouseup', handlers.handleMouseUp, true)
          rule.style.width = `${clampedWidth}px`
          dispatch({ type: END_RESIZING, id, width: clampedWidth })
        }
      }
      // Position mouse handlers to create a modal drag loop
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [id, rule, minWidth, dispatch]
  )
  return <div className='rrt-header-resizer' onMouseDown={handleMouseDown} />
}

HeaderResizer.propTypes = {
  column: ColumnType,
  layout: LayoutType
}

export default HeaderResizer
