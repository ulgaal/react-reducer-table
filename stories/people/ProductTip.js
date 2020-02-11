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
import './ProductTip.css'

export const ProductTip = props => {
  console.log('ProductTip', props)
  const {
    product: { department, price, product, productName, color }
  } = props
  return (
    <div className='product-tip'>
      <table>
        <tbody>
          <tr>
            <td>Department:</td>
            <td>{department}</td>
          </tr>
          <tr>
            <td>Product name:</td>
            <td>{productName}</td>
          </tr>
          <tr>
            <td>Product:</td>
            <td>{product}</td>
          </tr>
          <tr>
            <td>Price:</td>
            <td>{price} EUR</td>
          </tr>
          <tr>
            <td>Color:</td>
            <td className='product-tip-color'>
              <div style={{ backgroundColor: color }} />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <button>Buy now</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export const areEqual = (prev, next) => {
  const areEqual = prev.products === next.products
  /* if (!areEqual) {
      console.log('!ProductTip.areEqual')
    } */
  return areEqual
}

export default React.memo(ProductTip, areEqual)
