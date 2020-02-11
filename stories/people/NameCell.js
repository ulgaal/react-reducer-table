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
import { highlight } from './utils'
import { FiltersContext } from './People'

export const NameCell = props => {
  const { query } = useContext(FiltersContext)
  return (
    <div className='cell'>
      {highlight(query, props.row.name).map(({ text, highlight }, index) => (
        <span key={index} {...(highlight ? { className: 'highlighted' } : {})}>
          {text}
        </span>
      ))}
    </div>
  )
}

export const areEqual = (prev, next) => {
  const areEqual = prev.row.name === next.row.name
  /* if (!areEqual) {
      console.log('!NameCell.areEqual')
    } */
  return areEqual
}

export default React.memo(NameCell, areEqual)
