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
import { FiltersContext } from './contexts'
import { Source } from '@ulgaal/react-infotip'

export const SellerCell = props => {
  const {
    row: { id, name }
  } = props
  const { query } = useContext(FiltersContext)
  return (
    <div className='cell'>
      <Source id={`sel@${id}`}>
        {highlight(query, name).map(({ text, highlight }, index) => (
          <span
            key={index}
            {...(highlight ? { className: 'highlighted' } : {})}
          >
            {text}
          </span>
        ))}
      </Source>
    </div>
  )
}

export const areEqual = (prev, next) => {
  const prevRow = prev.row
  const nextRow = next.row
  const areEqual = prevRow.name === nextRow.name && prevRow.id === nextRow.id
  /* if (!areEqual) {
      console.log('!SellerCell.areEqual')
    } */
  return areEqual
}

export default React.memo(SellerCell, areEqual)
