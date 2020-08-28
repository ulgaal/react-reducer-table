import React from 'react'
import Head from './Head'
import Filters from './Filters'
import Body from './Body'
import './Section.css'

const Section = props => {
  // console.log('Section', props)
  const { mode, state, columns, overflow, hasFilters, colOrder } = props
  return (
    <div className={`rrt-section rrt-section-${mode}`}>
      <Head mode={mode} state={state} columns={columns} overflow={overflow} />
      {hasFilters ? (
        <Filters
          mode={mode}
          state={state}
          columns={columns}
          overflow={overflow}
        />
      ) : null}
      <Body mode={mode} state={state} columns={columns} colOrder={colOrder} />
    </div>
  )
}

export default Section
