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
import { getProperty } from '../../src'
import { Source } from '@ulgaal/react-infotip'
import './AddressCell.css'

const AddressCell = props => {
  const { row } = props
  const {
    id,
    address: { suite, street, zipcode, city }
  } = row
  const value = `${suite} ${street}, ${zipcode} ${city}`
  return (
    <Source id={`address@${id}`}>
      <div className='address-cell'>{value}</div>
    </Source>
  )
}

export const areEqual = (prev, next) => {
  const areEqual =
    getProperty(prev.row, prev.column.id) ===
    getProperty(next.row, next.column.id)
  /* if (!areEqual) {
      console.log('!AddressCell.areEqual')
    } */
  return areEqual
}

export default React.memo(AddressCell, areEqual)
