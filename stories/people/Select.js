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
import ReactSelect from 'react-select'
import Creatable from 'react-select/creatable'

export const selectStyles = {
  dropdownIndicator: (provided, state) => ({
    ...provided,
    padding: '0 8px 0 8px'
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    marginBottom: 0,
    marginTop: 0
  }),
  control: (provided, state) => ({ ...provided, minHeight: '20px' }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: '0 8px 0 8px'
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '2px 8px 2px 8px',
    color: '#777'
  })
}

const dayTheme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#84B3F0'
  }
})

const Select = props => (
  <ReactSelect styles={selectStyles} {...dayTheme} {...props} />
)

export const EditableSelect = props => {
  return (
    <DayNightContext.Consumer>
      {dayNight => {
        const theme = {
          theme: dayNight === 'day' ? dayTheme : nightTheme
        }
        return <Creatable styles={selectStyles} {...theme} {...props} />
      }}
    </DayNightContext.Consumer>
  )
}

export default Select
