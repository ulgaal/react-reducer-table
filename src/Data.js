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
  useMemo,
  useRef,
  useLayoutEffect,
  useState,
  createContext,
  useReducer
} from 'react'
import Section from './Section'
import Scroller from './Scroller'
import { TableStateType, Modes } from './prop-types'
import './Data.css'

export const ScrollerDispatch = createContext(null)
export const SCROLLABLE = 'SCROLLABLE'
export const FIXED = 'FIXED'
export const RESIZE = 'RESIZE'
export const SCROLL = 'SCROLL'

const scrollerReducer = (state, action) => {
  // console.log('scrollerReducer', state, action)
  const { type } = action
  switch (type) {
    case SCROLLABLE: {
      const { scrollableBody } = action
      return { ...state, scrollableBody }
    }
    case FIXED: {
      const { fixedBody } = action
      return { ...state, fixedBody }
    }
    case RESIZE: {
      const { scrollerHeight } = action
      return { ...state, scrollerHeight }
    }
    case SCROLL: {
      const { scrollTop, scrolling } = action
      return scrolling
        ? { ...state, scrolling, scrollTop }
        : { ...state, scrolling: false }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

const Data = props => {
  // console.log('Data', props)
  const { state } = props

  const { columns } = state

  // To keep head and body columns align when body Y scroller appears.
  const [overflow, setOverflow] = useState(false)
  const ref = useRef(null)
  useLayoutEffect(() => {
    const node = ref.current.querySelector('.rrt-tbody')
    setOverflow(node.scrollHeight > node.clientHeight)
  })

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

  const hasFixedCols = fixedCols.length > 0
  const [scrollerState, dispatch] = useReducer(scrollerReducer, {
    scrolling: false,
    scrollTop: 0,
    scrollerHeight: 0,
    bodyHeight: 0,
    rowsHeight: 0
  })

  return (
    <div className='rrt-data' ref={ref}>
      <ScrollerDispatch.Provider value={dispatch}>
        {hasFixedCols ? (
          <>
            <Section
              mode={Modes.fixed}
              state={state}
              columns={fixedCols}
              hasFilters={hasFilters}
              colOrder={colOrder}
              overflow={false}
            />
            <Section
              mode={Modes.scrollable}
              state={state}
              columns={cols}
              hasFilters={hasFilters}
              colOrder={colOrder}
              overflow={false}
            />
            <Scroller {...scrollerState} />
          </>
        ) : (
          <Section
            mode={Modes.stretch}
            state={state}
            columns={cols}
            hasFilters={hasFilters}
            colOrder={colOrder}
            overflow={overflow}
          />
        )}
      </ScrollerDispatch.Provider>
    </div>
  )
}

Data.propTypes = {
  state: TableStateType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.columns === nextState.columns &&
    prevState.data === nextState.data &&
    prevState.selectedIds === nextState.selectedIds
  /* if (!areEqual) {
    console.log('!Data.areEqual')
  } */
  return areEqual
}

export default React.memo(Data, areEqual)
