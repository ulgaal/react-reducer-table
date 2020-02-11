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
import { Button } from 'react-bootstrap'
import { styles } from './styles'
import Select from './Select'
import isEqual from 'lodash.isequal'
import { TableDispatch, PAGING, Icon, subst } from '../../src'
import './Pagination.css'

const Pagination = props => {
  // console.log('Pagination', props)
  const { state, pageSizes, components, labels } = props
  const { paginationExtra } = components
  const { pageIndex, pageSize, pageCount, total } = state
  const dispatch = useContext(TableDispatch)
  const btnStyle = { display: 'flex', justifyContent: 'center ' }
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
    <div className='pagination-info'>
      {paginationExtra
        ? React.createElement(paginationExtra.type, paginationExtra.props)
        : null}
      <span className='pagination-pages'>
        <Button
          style={btnStyle}
          title={labels.firstPage}
          variant={styles.BUTTON}
          onClick={() => dispatch({ type: PAGING, pageIndex: 0, pageSize })}
          disabled={!canPreviousPage}
        >
          <Icon icon='first' />
        </Button>
        <Button
          style={btnStyle}
          title={labels.previousPage}
          variant={styles.BUTTON}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageIndex - 1, pageSize })
          }
          disabled={!canPreviousPage}
        >
          <Icon icon='previous' />
        </Button>
        <span className='pagination-of'>
          <span>{labels.page}</span>
          <input
            type='number'
            onChange={e => {
              const value = e.target.value ? Number(e.target.value) : 1
              const page = Math.min(Math.max(1, value), pageCount) - 1
              dispatch({ type: PAGING, pageIndex: page, pageSize })
            }}
            className='pagination-input'
            value={pageIndex + 1}
          />{' '}
          <span>
            {subst({ tpl: labels.ofPages, data: { pages: pageCount || 1 } })}
          </span>
        </span>
        <Button
          style={btnStyle}
          title={labels.nextPage}
          variant={styles.BUTTON}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageIndex + 1, pageSize })
          }
          disabled={!canNextPage}
        >
          <Icon icon='next' />
        </Button>
        <Button
          style={btnStyle}
          title={labels.lastPage}
          variant={styles.BUTTON}
          onClick={() =>
            dispatch({ type: PAGING, pageIndex: pageCount - 1, pageSize })
          }
          disabled={!canNextPage}
        >
          <Icon icon='last' />
        </Button>
      </span>
      <Select
        className='pagination-sizes'
        isSearchable
        options={pageSizeOptions}
        value={pageSizeOptions.find(({ value }) => value === pageSize) || null}
        onChange={({ value }) => {
          dispatch({ type: PAGING, pageIndex, pageSize: value })
        }}
        menuPlacement='auto'
      />
      <span className='pagination-view' title={message}>
        {message}
      </span>
    </div>
  )
}

export default React.memo(Pagination, (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prevState.pageIndex === nextState.pageIndex &&
    prevState.pageSize === nextState.pageSize &&
    prevState.pageCount === nextState.pageCount &&
    prevState.total === nextState.total &&
    (!prev.components.paginationExtra ||
      isEqual(
        prev.components.paginationExtra.props,
        next.components.paginationExtra.props
      ))

  /*if (!areEqual) {
    console.log('!Pagination.areEqual')
  }*/
  return areEqual
})
