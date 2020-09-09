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
import { createContext } from 'react'
export const ScrollerDispatch = createContext(null)
export const SCROLLABLE = 'SCROLLABLE'
export const FIXED = 'FIXED'
export const VRESIZE = 'VRESIZE'
export const VSCROLL = 'VSCROLL'

export const scrollerReducer = (state, action) => {
  // console.log('scrollerReducer', state, action)
  const { type } = action
  switch (type) {
    case SCROLLABLE: {
      const { scrollableBody } = action
      return { ...state, scrollableBody }
    }
    case FIXED: {
      const { fixedBody } = action
      return { ...state, fixedBody }
    }
    case VRESIZE: {
      const { scrollerHeight } = action
      return { ...state, scrollerHeight }
    }
    case VSCROLL: {
      const { scrollTop, scrolling } = action
      return scrolling
        ? { ...state, scrolling, scrollTop }
        : { ...state, scrolling: false }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
