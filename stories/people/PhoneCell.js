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

const PhoneCell = props => {
  return <div className='cell'>{props.row.phone}</div>
}

export const areEqual = (prev, next) => {
  const areEqual = prev.row.phone === next.row.phone
  /* if (!areEqual) {
      console.log('!PhoneCell.areEqual')
    } */
  return areEqual
}

export default React.memo(PhoneCell, areEqual)
