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
import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { TableStateType } from './prop-types'
import Icon from './Icon'
import { ConfigContext } from './Table'
import { TableDispatch, PAGING } from './actions'
import { subst } from './utils'
import './Pagination.css'

/**
 * Component to handle pagination
 */
const Pagination = props => {
  // console.log('Pagination', props)
  const { labels, components } = useContext(ConfigContext)
  const { state, pageSizes } = props
  const { paginationExtra } = components
  const { pageIndex, pageSize, pageCount, total } = state
  const dispatch = useContext(TableDispatch)
  const pageSizeOptions = useMemo(
    () =>
      pageSizes.map(value => ({
        value,
        label: subst({ tpl: labels.rows, data: { value } })
      })),
    [labels, pageSizes]
  )
  const canPreviousPage = pageIndex > 0
  const canNextPage = pageIndex < pageCount - 1
  const message =
    total > 0
      ? subst({
          tpl: labels.range,
          data: {
            first: pageIndex * pageSize + 1,
            last: Math.min(total, (pageIndex + 1) * pageSize),
            total
          }
        })
      : labels.noData
  return (
    <div className='rrt-pagination-info'>
      {paginationExtra
        ? React.createElement(paginationExtra.type, paginationExtra.props)
        : null}
      <div className='rrt-pagination-pages'>
        <button
          title={labels.firstPage}
          onClick={() => dispatch({ type: PAGING, pageIndex: 0, pageSize })}
          disabled={!canPreviousPage}
        >
          <Icon icon='first' />
        </button>
        <button
          title={labels.previousPage}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageIndex - 1, pageSize })
          }
          disabled={!canPreviousPage}
        >
          <Icon icon='previous' />
        </button>
        <div className='rrt-pagination-of'>
          <span>{labels.page}</span>
          <input
            type='number'
            onChange={e => {
              const value = e.target.value ? Number(e.target.value) : 1
              const page = Math.min(Math.max(1, value), pageCount) - 1
              dispatch({ type: PAGING, pageIndex: page, pageSize })
            }}
            className='rrt-pagination-input'
            value={pageIndex + 1}
          />{' '}
          <span>
            {subst({ tpl: labels.ofPages, data: { pages: pageCount || 1 } })}
          </span>
        </div>
        <button
          title={labels.nextPage}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageIndex + 1, pageSize })
          }
          disabled={!canNextPage}
        >
          <Icon icon='next' />
        </button>
        <button
          title={labels.lastPage}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageCount - 1, pageSize })
          }
          disabled={!canNextPage}
        >
          <Icon icon='last' />
        </button>
      </div>
      <select
        value={pageSize}
        onChange={event => {
          dispatch({ type: PAGING, pageIndex, pageSize: event.target.value })
        }}
      >
        {pageSizeOptions.map(({ value, label }, index) => (
          <option key={index} value={value}>
            {label}
          </option>
        ))}
      </select>
      <span className='rrt-pagination-view' title={message}>
        {message}
      </span>
    </div>
  )
}

Pagination.propTypes = {
  /**
   * The state of the pagination component (see [Table](./Table.md) for more details)
   */
  state: TableStateType,
  /**
   * An array of supported page sizes.
   */
  pageSizes: PropTypes.arrayOf(PropTypes.number)
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.pageIndex === nextState.pageIndex &&
    prevState.pageSize === nextState.pageSize &&
    prevState.pageCount === nextState.pageCount &&
    prevState.total === nextState.total

  /*if (!areEqual) {
    console.log('!Pagination.areEqual')
  }*/
  return areEqual
}

export default React.memo(Pagination, areEqual)
