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
import React, { useContext, useMemo, useRef, useEffect, useState } from 'react'
import { ConfigContext } from './Table'
import { RangeType, Modes, ModeType } from './prop-types'
import isEqual from 'lodash.isequal'
import { log } from './utils'
import './Range.css'

const Range = props => {
  log('Range', 0, props)
  const { rowIdAttr } = useContext(ConfigContext)
  const {
    range: { row, col, width, height, split },
    mode
  } = props
  const ref = useRef(null)
  const className = useMemo(() => {
    const classes = [
      'rrt-range',
      ...(split ? [`rrt-range-${mode}`] : []),
      ...(width * height > 1 ? ['rrt-range-surface'] : [])
    ]
    return classes.join(' ')
  }, [width, height, mode])
  const [style, setStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  })
  useEffect(() => {
    const { current } = ref
    if (current) {
      const rows = current.parentNode
      if (rows) {
        const upperRow = rows.children[row]
        const lowerRow = rows.children[row + height - 1]
        if (upperRow && lowerRow) {
          // Take into account the extra selection column if row selection is enabled
          const dx = rowIdAttr && mode !== Modes.scrollable ? 1 : 0
          const leftCell = upperRow.children[col + dx]
          const rightCell = lowerRow.children[col + width - 1 + dx]
          if (leftCell && rightCell) {
            const rowsRect = rows.getBoundingClientRect()
            const upperLeft = leftCell.getBoundingClientRect()
            const lowerRight = rightCell.getBoundingClientRect()
            const { x, y } = upperLeft
            const newStyle = {
              left: `${x - rowsRect.x}px`,
              top: `${y - rowsRect.y}px`,
              width: `${lowerRight.x + lowerRight.width - x}px`,
              height: `${lowerRight.y + lowerRight.height - y}px`
            }
            if (!isEqual(style, newStyle)) {
              setStyle(newStyle)
            }
          }
        }
      }
    }
  })
  return <div ref={ref} className={className} style={style} />
}

Range.propTypes = {
  range: RangeType,
  mode: ModeType
}

export const areEqual = (prev, next) => {
  const areEqual = prev.range === next.range
  /* if (!areEqual) {
      console.log('!Range.areEqual')
    } */
  return areEqual
}
export default React.memo(Range, areEqual)
