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
import './AddressTip.css'

const AddressTip = props => {
  const {
    address: {
      suite,
      street,
      zipcode,
      city,
      geo: { lat, lng }
    }
  } = props
  return (
    <div className='address-tip'>
      <table>
        <tbody>
          <tr>
            <td className='address-tip-key'>Suite:</td>
            <td>{suite}</td>
          </tr>
          <tr>
            <td className='address-tip-key'>Street:</td>
            <td>{street}</td>
          </tr>
          <tr>
            <td className='address-tip-key'>Zip Code:</td>
            <td>{zipcode}</td>
          </tr>
          <tr>
            <td className='address-tip-key'>City:</td>
            <td>{city}</td>
          </tr>
          <tr>
            <td className='address-tip-key'>Latitute:</td>
            <td>{lat}</td>
          </tr>
          <tr>
            <td className='address-tip-key'>Longitude:</td>
            <td>{lng}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const areEqual = (prev, next) => {
  const areEqual = prev.address === next.address
  /* if (!areEqual) {
        console.log('!AddressTip.areEqual')
      } */
  return areEqual
}

export default React.memo(AddressTip, areEqual)
