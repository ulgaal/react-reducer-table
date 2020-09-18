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
import React, { useCallback, useContext, useState } from 'react'
import PropTypes from 'prop-types'
import { ColumnType, LayoutType } from './prop-types'
import {
  ResizerContext,
  START_RESIZING,
  END_RESIZING,
  RESIZE
} from './reducers/resizerReducer'
import { DEFAULT_MIN_WIDTH, ConfigContext } from './Table'
import { measureCols } from './utils'
import { TableDispatch, COLUMN_RESIZING } from './actions'
import './HeaderResizer.css'

const HeaderResizer = props => {
  const {
    index,
    column,
    layout: { rule }
  } = props
  const { id, minWidth = DEFAULT_MIN_WIDTH } = column
  const [timeStamp, setTimeStamp] = useState(0)
  const resizerDispatch = useContext(ResizerContext)
  const dispatch = useContext(TableDispatch)
  const { rowIdAttr, context } = useContext(ConfigContext)

  const handleAutoresize = useCallback(
    event => {
      const { minWidth = DEFAULT_MIN_WIDTH } = column
      const columns = [{ ...column, autoresize: true, index, minWidth }]
      const section = event.target.closest('.rrt-section')
      if (section) {
        const metrics = measureCols(
          context,
          columns,
          section,
          section.classList.contains('rrt-section-scrollable') ? '' : rowIdAttr
        )
        metrics.forEach(metric => {
          const {
            column: { id, width }
          } = metric
          if (metric.width !== width) {
            dispatch({ type: COLUMN_RESIZING, id, width: metric.width })
          }
        })
      }
    },
    [rowIdAttr, index, context, dispatch]
  )

  const handleResize = useCallback(
    event => {
      event.stopPropagation()
      event.preventDefault()
      const table = event.target.closest('.rrt-container')
      const { left } = table.getBoundingClientRect()
      const x0 = event.clientX - left
      let x1
      let clampedWidth

      // current column width
      const { width } = event.target.closest('.rrt-th').getBoundingClientRect()
      resizerDispatch({ type: START_RESIZING, x: x0 })
      const handlers = {
        handleMouseMove: event => {
          event.stopPropagation()
          event.preventDefault()
          const dx = event.clientX - left - x0
          clampedWidth = Math.max(minWidth, width + dx)
          x1 = x0 + clampedWidth - width
          resizerDispatch({ type: RESIZE, x: x1 })
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
          resizerDispatch({ type: END_RESIZING, id, width: clampedWidth })
        }
      }
      // Position mouse handlers to create a modal drag loop
      window.addEventListener('mousemove', handlers.handleMouseMove, true)
      window.addEventListener('mouseup', handlers.handleMouseUp, true)
    },
    [id, rule, minWidth, resizerDispatch]
  )

  // Dispatch event between resize and autoresize handlers based on
  // whether the user has made a single or double click
  const handleMouseDown = useCallback(
    event => {
      const dt = event.timeStamp - timeStamp
      if (dt < 500) {
        handleAutoresize(event)
      } else {
        setTimeStamp(event.timeStamp)
        handleResize(event)
      }
    },
    [timeStamp]
  )
  return <div className='rrt-header-resizer' onMouseDown={handleMouseDown} />
}

HeaderResizer.propTypes = {
  index: PropTypes.number,
  column: ColumnType,
  layout: LayoutType
}

export default HeaderResizer
