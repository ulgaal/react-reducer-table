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
import React, { useContext, useCallback, useRef, useEffect } from 'react'
import Row from './Row'
import Range from './Range'
import { ConfigContext } from './Table'
import { TableDispatch, SELECTING, VSCROLL } from './actions'
import PropTypes from 'prop-types'
import { TableStateType, ColumnsType, Modes, RangeType } from './prop-types'
import { SCROLLABLE, FIXED, ScrollerDispatch } from './reducers/scrollerReducer'
import { LEVELS, log } from './utils'
import './Body.css'

const Body = props => {
  log('Body', LEVELS.INFO, props)
  const { rowIdAttr } = useContext(ConfigContext)
  const scrollerDispatch = useContext(ScrollerDispatch)
  const { state, columns, colOrder, mode, range } = props
  const { data, selectedIds, scrollTop = 0 } = state
  const dispatch = useContext(TableDispatch)
  const handleCellCheckChange = useCallback(
    event => {
      const id = event.target.dataset.id
      const newSelectedIds = new Set(selectedIds)
      if (event.target.checked) {
        newSelectedIds.add(id)
      } else {
        newSelectedIds.delete(id)
      }
      dispatch({
        type: SELECTING,
        selectedIds: newSelectedIds
      })
    },
    [selectedIds, dispatch]
  )

  const handleScroll = useCallback(event => {
    dispatch({ type: VSCROLL, scrollTop: event.target.scrollTop })
  }, [])

  const ref = useRef(null)
  useEffect(() => {
    const { current } = ref
    if (current) {
      // For table with fixed cols, take measurements
      // to power parallel vertical scrolling of the two sections if needed
      if (mode === Modes.scrollable) {
        scrollerDispatch({
          type: SCROLLABLE,
          scrollableBody: current
        })
      } else if (mode === Modes.fixed) {
        scrollerDispatch({ type: FIXED, fixedBody: current })
      }
      // Programmatic control of the vertical scrolling
      if (scrollTop > 0) {
        current.scrollTop = scrollTop
      }
    }
  })
  return (
    <div
      className='rrt-tbody'
      ref={ref}
      onChange={handleCellCheckChange}
      onScroll={handleScroll}
    >
      <div className='rrt-tbody-rows'>
        {data.map((row, index) => {
          const id = row[rowIdAttr]
          const selected = rowIdAttr && selectedIds.has(id)
          return (
            <Row
              key={index}
              columns={columns}
              colOrder={colOrder}
              id={id}
              row={row}
              selected={selected}
              mode={mode}
            />
          )
        })}
        {range ? <Range range={range} mode={mode} /> : null}
      </div>
    </div>
  )
}

Body.propTypes = {
  state: TableStateType,
  columns: ColumnsType,
  colOrder: PropTypes.string,
  range: RangeType
}

Body.displayName = 'Body'

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prev.colOrder === next.colOrder &&
    prev.range === next.range &&
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds &&
    prevState.scrollTop === nextState.scrollTop
  /* if (!areEqual) {
    console.log('!Body.areEqual')
  } */
  return areEqual
}

export default React.memo(Body, areEqual)
