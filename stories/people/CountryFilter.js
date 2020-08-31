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
import React, { useContext, useMemo, useCallback } from 'react'
import './CountryFilter.css'
import { TableDispatch, Icon } from '../../src'
import { FiltersContext } from './contexts'
import { FILTERING } from './peopleReducer'

const CountryFilter = props => {
  const { filter, countries } = useContext(FiltersContext)
  const dispatch = useContext(TableDispatch)
  const filterOptions = useMemo(
    () =>
      countries.map(country => ({
        label: country,
        value: country
      })),
    [countries]
  )
  const handleChange = useCallback(event => {
    const value = event.target.value
    if (value !== -1) {
      dispatch({ type: FILTERING, filter: value })
    }
  }, [])
  const selectedValue =
    filterOptions.find(({ value }) => value === filter) || null
  return (
    <div className='country-filter'>
      <select onChange={handleChange}>
        <option key='nosel' value={-1}>
          Select...
        </option>
        {filterOptions.map(({ value, label }, index) => (
          <option key={index} value={value} selected={value === selectedValue}>
            {label}
          </option>
        ))}
      </select>
      {selectedValue ? (
        <Icon
          icon='cancel'
          title='Clear'
          onClick={event => {
            dispatch({ type: FILTERING, filter: null })
          }}
        />
      ) : null}
    </div>
  )
}
export default CountryFilter
