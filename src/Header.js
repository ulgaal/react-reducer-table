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
import SortArrow from './SortArrow'
import HeaderResizer from './HeaderResizer'
import { encode, ASC, DESC } from './orders'
import { TableDispatch, SORTING } from './actions'
import PropTypes from 'prop-types'
import { ColumnType, LayoutType } from './prop-types'
import { log } from './utils'
import './Header.css'

const Header = props => {
  log('Header', 0, props)
  const { index, column, layout, sorted, resizable } = props
  const { id, label, sortable = true } = column
  const dispatch = useContext(TableDispatch)

  const handleClick = useCallback(
    event => {
      dispatch({
        type: SORTING,
        sort: encode({ order: sorted === false ? DESC : ASC, name: id })
      })
    },
    [id, sorted, dispatch]
  )

  return (
    <div className='rrt-header'>
      <div
        className='rrt-header-title'
        title={label}
        onClick={sortable ? handleClick : null}
      >
        <div className='rrt-header-label'>{label}</div>
        <div className='rrt-header-arrow'>
          <SortArrow sortable={sortable} sorted={sorted} />
        </div>
      </div>
      {resizable ? (
        <div className='rrt-header-resizer'>
          <HeaderResizer index={index} column={column} layout={layout} />
        </div>
      ) : null}
    </div>
  )
}

Header.displayName = 'Header'

Header.propTypes = {
  index: PropTypes.number,
  column: ColumnType,
  layout: LayoutType,
  sorted: PropTypes.bool,
  resizable: PropTypes.bool,
  onColumnResize: PropTypes.func
}

export const areEqual = (prev, next) => {
  const areEqual =
    prev.column === next.column &&
    prev.resizable === next.resizable &&
    prev.sorted === next.sorted
  /*if (!areEqual) {
    console.log('!Header.areEqual')
  }*/
  return areEqual
}

export default React.memo(Header, areEqual)
