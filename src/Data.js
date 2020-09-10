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
import React, {
  useContext,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  useState
} from 'react'
import Section from './Section'
import VScroller from './VScroller'
import { TableStateType, ScrollerStateType, Modes } from './prop-types'
import { ConfigContext } from './Table'
import { TableDispatch, CELL_RANGE } from './actions'
import isEqual from 'lodash.isequal'
import './Data.css'

const Data = props => {
  // console.log('Data', props)
  const { state, scrollerState } = props
  const { columns, cellRange } = state

  const dispatch = useContext(TableDispatch)
  const { rowIdAttr } = useContext(ConfigContext)

  // To keep head and body columns align when body Y scroller appears.
  const [overflow, setOverflow] = useState(false)
  const ref = useRef(null)
  useLayoutEffect(() => {
    const node = ref.current.querySelector('.rrt-tbody')
    setOverflow(node.scrollHeight > node.clientHeight)
  })

  // Split columns into two sets (fixed and horizontally scrollable)
  // Determine if there are any filters
  // Compute the column order
  const { fixedCols, cols, hasFilters, colOrder } = useMemo(() => {
    const visibleCols = columns.filter(col => col.visible !== false)
    const { ids, ...rest } = visibleCols.reduce(
      (acc, col) => {
        const { id, fixed, Filter } = col
        const { fixedCols, cols, ids } = acc
        ids.push(id)
        if (fixed) {
          if (cols.length) {
            throw new Error(
              `fixed column ${id} must be declared before non-fixed columns`
            )
          }
          fixedCols.push(col)
        } else {
          cols.push(col)
        }
        if (Filter) {
          acc.hasFilters = true
        }
        return acc
      },
      {
        fixedCols: [],
        cols: [],
        hasFilters: false,
        ids: []
      }
    )
    return { colOrder: ids.join(','), ...rest }
  }, [columns])

  // If there are fixed columns, the table uses two
  // sections and a vertical scroller to scroll them in parallel
  // Otherwise, there is just one section
  const { hasFixedCols, fixedRange, range } = useMemo(() => {
    // If there are fixed columns, split the cell range if necessary
    const hasFixedCols = fixedCols.length > 0
    let range = null
    let fixedRange = null
    if (hasFixedCols && cellRange) {
      const xmid = fixedCols.length
      const { col: x } = cellRange
      const xmax = x + cellRange.width
      if (xmax <= xmid) {
        fixedRange = { ...cellRange, split: false }
      } else if (x >= xmid) {
        range = { ...cellRange, col: x - xmid, split: false }
      } else {
        fixedRange = { ...cellRange, width: xmid - x, split: true }
        range = {
          ...cellRange,
          col: 0,
          width: xmax - xmid,
          split: true
        }
      }
    } else {
      range = { ...cellRange, mode: Modes.stretch }
    }
    return { hasFixedCols, range, fixedRange }
  }, [fixedCols, cellRange])

  const handleRange = useCallback(
    event => {
      console.log('handleRange', event)
      if (cellRange) {
        // Process events only if there is a call range
        const getPosition = event => {
          const cellElement = event.target.closest('.rrt-td')
          if (!cellElement) {
            return null
          }
          const rowElement = cellElement.parentNode
          const rowsElement = rowElement.parentNode
          const section = rowElement.closest('.rrt-section-scrollable')
          const xmid = fixedCols.length
          const dx = rowIdAttr ? 1 : 0
          const row = Array.prototype.indexOf.call(
            rowsElement.childNodes,
            rowElement
          )
          const col = Array.prototype.indexOf.call(
            rowElement.childNodes,
            cellElement
          )
          return {
            row,
            col: section ? xmid + col : col - dx
          }
        }
        const createRange = (pos1, pos2) => {
          const col = Math.min(pos1.col, pos2.col)
          const row = Math.min(pos1.row, pos2.row)
          return {
            col,
            row,
            width: Math.max(pos1.col, pos2.col) - col + 1,
            height: Math.max(pos1.row, pos2.row) - row + 1
          }
        }
        const pos1 = getPosition(event)
        if (pos1) {
          event.stopPropagation()
          event.preventDefault()
          // Process events only if a cell has been clicked
          const range1 = { ...pos1, width: 1, height: 1 }
          if (!isEqual(range1, cellRange)) {
            dispatch({
              type: CELL_RANGE,
              cellRange: range1
            })
          }
          const handlers = {
            handleMouseMove: event => {
              event.stopPropagation()
              event.preventDefault()
              const pos2 = getPosition(event)
              if (pos2 && !isEqual(pos1, pos2)) {
                const range2 = createRange(pos1, pos2)
                if (!isEqual(range1, range2)) {
                  dispatch({
                    type: CELL_RANGE,
                    cellRange: range2
                  })
                }
              }
            },
            handleMouseUp: event => {
              event.stopPropagation()
              event.preventDefault()
              window.removeEventListener(
                'mousemove',
                handlers.handleMouseMove,
                true
              )
              window.removeEventListener(
                'mouseup',
                handlers.handleMouseUp,
                true
              )
            }
          }
          // Position mouse handlers to create a modal drag loop
          window.addEventListener('mousemove', handlers.handleMouseMove, true)
          window.addEventListener('mouseup', handlers.handleMouseUp, true)
        }
      }
    },
    [cellRange, fixedCols, rowIdAttr]
  )

  return (
    <div className='rrt-data' ref={ref} onMouseDown={handleRange}>
      {hasFixedCols ? (
        <>
          <Section
            mode={Modes.fixed}
            state={state}
            columns={fixedCols}
            hasFilters={hasFilters}
            colOrder={colOrder}
            overflow={false}
            range={fixedRange}
          />
          <Section
            mode={Modes.scrollable}
            state={state}
            columns={cols}
            hasFilters={hasFilters}
            colOrder={colOrder}
            overflow={false}
            range={range}
          />
          <VScroller state={scrollerState} />
        </>
      ) : (
        <Section
          mode={Modes.stretch}
          state={state}
          columns={cols}
          hasFilters={hasFilters}
          colOrder={colOrder}
          overflow={overflow}
          range={range}
        />
      )}
    </div>
  )
}

Data.propTypes = {
  state: TableStateType,
  scrollerState: ScrollerStateType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.columns === nextState.columns &&
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds &&
    prevState.cellRange === nextState.cellRange &&
    prev.scrollerState === next.scrollerState
  /* if (!areEqual) {
    console.log('!Data.areEqual')
  } */
  return areEqual
}

export default React.memo(Data, areEqual)
