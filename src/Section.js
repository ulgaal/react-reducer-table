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
import React from 'react'
import Head from './Head'
import Filters from './Filters'
import Body from './Body'
import {
  ModeType,
  ColumnsType,
  TableStateType,
  RangeType,
  Modes
} from './prop-types'
import PropTypes from 'prop-types'
import { LEVELS, log } from './utils'
import './Section.css'

const Section = props => {
  log('Section', LEVELS.INFO, props)
  const {
    mode,
    state,
    columns,
    overflow,
    hasFilters,
    colOrder,
    range,
    stretch
  } = props
  const style = {
    alignItems: stretch || mode === Modes.stretch ? 'stretch' : 'flex-start'
  }
  return (
    <div className={`rrt-section rrt-section-${mode}`} style={style}>
      <Head mode={mode} state={state} columns={columns} overflow={overflow} />
      {hasFilters ? (
        <Filters
          mode={mode}
          state={state}
          columns={columns}
          overflow={overflow}
        />
      ) : null}
      <Body
        mode={mode}
        state={state}
        columns={columns}
        colOrder={colOrder}
        range={range}
      />
    </div>
  )
}

Section.displayName = 'Section'

Section.propTypes = {
  mode: ModeType,
  state: TableStateType,
  columns: ColumnsType,
  overflow: PropTypes.bool,
  stretch: PropTypes.bool,
  hasFilters: PropTypes.bool,
  colOrder: PropTypes.string,
  range: RangeType
}
export default Section
