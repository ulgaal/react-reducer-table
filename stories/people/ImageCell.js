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

export const ImageCell = props => {
  const { name, image } = props.row
  return <img src={image} className='people-img' alt={name} />
}

export const areEqual = (prev, next) => {
  const prevRow = prev.row
  const nextRow = next.row
  const areEqual =
    prevRow.name === nextRow.name && prevRow.image === nextRow.image
  /* if (!areEqual) {
      console.log('!ImageCell.areEqual')
    } */
  return areEqual
}

export default React.memo(ImageCell, areEqual)
