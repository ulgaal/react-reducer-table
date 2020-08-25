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
import HeaderCheckbox from './HeaderCheckbox'
import HeadContent from './HeadContent'
import PropTypes from 'prop-types'
import { TableStateType, ColumnsType, LayoutsType } from './prop-types'
import './Head.css'

const Head = props => {
  // console.log('Head', props)
  const { rowIdAttr } = useContext(ConfigContext)
  const { state, columns, layouts, overflow } = props
  return (
    <div className='rrt-thead'>
      {
        <div className={`rrt-tr${overflow ? ' overflow' : ''}`}>
          {rowIdAttr ? <HeaderCheckbox state={state} /> : null}
          <HeadContent state={state} columns={columns} layouts={layouts} />
        </div>
      }
    </div>
  )
}

Head.propTypes = {
  state: TableStateType,
  columns: ColumnsType,
  layouts: LayoutsType,
  overflow: PropTypes.bool
}

export const areEqual = (prev, next) => {
  const prevState = prev.state
  const nextState = next.state
  const areEqual =
    prev.columns === next.columns &&
    prevState.selectedIds === nextState.selectedIds &&
    prevState.sort === next.sort &&
    prevState.data === next.data &&
    prev.overflow === next.overflow
  /* if (!areEqual) {
    console.log('!Head.areEqual')
  } */
  return areEqual
}

export default React.memo(Head, areEqual)
