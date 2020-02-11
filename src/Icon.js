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
import PropTypes from 'prop-types'
import { IconType } from './prop-types'
import Up from './svg/arrow-up'
import Down from './svg/arrow-down'
import First from './svg/skip-back'
import Previous from './svg/rewind'
import Next from './svg/fast-forward'
import Last from './svg/skip-forward'
import Cancel from './svg/x'
import './Icon.css'

const Icon = props => {
  const { icon, title, className, style, onClick, ...rest } = props
  let component = null
  switch (icon) {
    case 'up':
      component = Up
      break
    case 'down':
      component = Down
      break
    case 'first':
      component = First
      break
    case 'previous':
      component = Previous
      break
    case 'next':
      component = Next
      break
    case 'last':
      component = Last
      break
    case 'cancel':
      component = Cancel
      break
  }
  return (
    <div
      className={`rrt-icon ${className || ''}`}
      style={style}
      onClick={onClick}
      title={title}
    >
      {React.createElement(component, rest)}
    </div>
  )
}
Icon.propTypes = {
  icon: IconType.isRequired,
  title: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  onClick: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number
}
export default Icon
