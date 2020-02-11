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
import React, { useContext, useState, useCallback } from 'react'
import './NameFilter.css'
import { TableDispatch, Icon } from '../../src'
import { FiltersContext } from './People'
import { QUERYING } from './peopleReducer'

const NameFilter = props => {
  const { query } = useContext(FiltersContext)
  const dispatch = useContext(TableDispatch)
  const [timeoutId, setTimeoutId] = useState(0)
  const [value, setValue] = useState(query || '')
  const handleChange = useCallback(
    v => {
      setValue(v)
      if (timeoutId) {
        clearTimeout(timeoutId)
        setTimeoutId(
          setTimeout(() => {
            dispatch({ type: QUERYING, query: value })
          }, 300)
        )
      }
    },
    [dispatch, timeoutId, value]
  )
  return (
    <div className='name-filter'>
      <div className='name-filter-field'>
        <input
          type='text'
          placeholder='Type people naming pattern to filter table...'
          value={value}
          onChange={event => {
            handleChange(event.target.value)
            dispatch({ type: QUERYING, query: event.target.value })
          }}
        />
      </div>
      {query ? (
        <Icon
          icon='cancel'
          title='Clear'
          onClick={event => {
            handleChange('')
            dispatch({ type: QUERYING, query: '' })
          }}
        />
      ) : null}
    </div>
  )
}

/*
    const { filterTimeoutId } = this.state
    if (filterTimeoutId) {
      clearTimeout(filterTimeoutId)
    }
    this.setState({
      filterTimeoutId: setTimeout(() => {
        onSelect([...selectedIds], false)
        this.update()
      }, 300)
    })
*/

export default NameFilter
