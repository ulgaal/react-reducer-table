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
import React, { useMemo, useRef, useLayoutEffect, useState } from 'react'
import Head from './Head'
import Filters from './Filters'
import Body from './Body'
import './Data.css'
import { TableStateType } from './prop-types'

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

  const hasFilters = useMemo(() => columns.some(({ Filter }) => !!Filter), [
    columns
  ])

  // Keep track of the order of columns
  const colOrder = useMemo(() => columns.map(({ id }) => id).join(','), [
    columns
  ])

  return (
    <div className='rrt-data' ref={ref}>
      <Head state={state} columns={columns} overflow={overflow} />
      {hasFilters ? (
        <Filters state={state} columns={columns} overflow={overflow} />
      ) : null}
      <Body state={state} columns={columns} colOrder={colOrder} />
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
