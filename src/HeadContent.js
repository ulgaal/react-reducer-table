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
import { decode, DESC } from './orders'
import { ConfigContext } from './Table'
import { TableDispatch, COLUMN_REORDERING } from './actions'
import { TableStateType, ColumnsType, LayoutsType } from './prop-types'

const HeadContent = props => {
  // console.log('HeadContent', props)
  const { components } = useContext(ConfigContext)
  const { state, columns, layouts } = props
  const dispatch = useContext(TableDispatch)
  const { header } = components

  const { sort } = state
  const { order, name } = decode(sort)

  const handleDragStart = useCallback(event => {
    event.dataTransfer.setData('text/plain', event.target.dataset.id)
  }, [])
  const handleDragOver = useCallback(event => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])
  const handleDrop = useCallback(
    event => {
      const ida = event.target.closest('.rrt-th').dataset.id
      const idb = event.dataTransfer.getData('text/plain')
      if (ida !== idb) {
        // console.log('handleDrop', { ida, idb })
        const newColumns = [...columns]
        const ixa = columns.findIndex(({ id }) => id === ida)
        const ixb = columns.findIndex(({ id }) => id === idb)
        newColumns[ixa] = columns[ixb]
        newColumns[ixb] = columns[ixa]
        dispatch({ type: COLUMN_REORDERING, columns: newColumns })
      }
      event.preventDefault()
      event.stopPropagation()
    },
    [columns, dispatch]
  )

  return (
    <>
      {columns.map((column, index) => {
        const { id, resizable = true, sortable = true } = column
        const layout = layouts[id]
        const { className } = layout
        const shouldFlex = resizable && index === columns.length - 1
        const sorted = sortable && name === id ? order === DESC : undefined
        const props = {
          column,
          layout,
          sorted,
          resizable: resizable && !shouldFlex,
          ...header.props
        }
        return (
          <div
            key={index}
            className={`rrt-th ${className}${shouldFlex ? ' flex' : ''}`}
            onDragStart={handleDragStart}
            draggable
            data-id={id}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {React.createElement(header.type, props)}
          </div>
        )
      })}
    </>
  )
}

HeadContent.propTypes = {
  state: TableStateType,
  columns: ColumnsType,
  layouts: LayoutsType
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prev.columns === next.columns && prevState.sort === nextState.sort
  /* if (!areEqual) {
    console.log('!HeadContent.areEqual')
  } */
  return areEqual
}

export default React.memo(HeadContent, areEqual)
