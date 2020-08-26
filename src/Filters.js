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
import React, { useContext } from 'react'
import { ConfigContext } from './Table'
import './Filters.css'
import PropTypes from 'prop-types'
import { TableStateType, ColumnsType } from './prop-types'

const Filters = props => {
  // console.log('Filters', props)
  const { layouts, rowIdAttr } = useContext(ConfigContext)
  const { columns, overflow, state } = props

  return (
    <div className='rrt-filters'>
      {
        <div className={`rrt-tr${overflow ? ' overflow' : ''}`}>
          {rowIdAttr ? <div className='rrt-th selection' /> : null}
          {columns.map((column, index) => {
            const { id, Filter, resizable = true } = column
            const layout = layouts[id]
            const { className } = layout
            const shouldFlex = resizable && index === columns.length - 1
            const props = {
              column,
              resizable: resizable && !shouldFlex,
              state
            }
            return (
              <div
                key={index}
                className={`rrt-th ${className}${shouldFlex ? ' flex' : ''}`}
              >
                {Filter ? React.createElement(Filter, props) : null}
              </div>
            )
          })}
        </div>
      }
    </div>
  )
}

Filters.propTypes = {
  state: TableStateType,
  columns: ColumnsType,
  overflow: PropTypes.bool
}

export const areEqual = (prev, next) => {
  const areEqual =
    prev.columns === next.columns && prev.overflow === next.overflow
  /*if (!areEqual) {
    console.log('!Filters.areEqual')
  }*/
  return areEqual
}

export default React.memo(Filters, areEqual)
