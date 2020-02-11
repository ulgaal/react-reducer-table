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
import { Product } from './Product'
import './ProductsCell.css'

export const ProductsCell = props => {
  // console.log('ProductsCell', props)
  const {
    row: { products }
  } = props
  return (
    <div className='products'>
      {products.map((product, id) => {
        return <Product key={id} product={product} />
      })}
    </div>
  )
}

export const areEqual = (prev, next) => {
  const areEqual = prev.row.products === next.row.products
  /* if (!areEqual) {
      console.log('!ProductsCell.areEqual')
    } */
  return areEqual
}

export default React.memo(ProductsCell, areEqual)
