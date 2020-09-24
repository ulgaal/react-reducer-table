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
import { log } from '../utils'
export const ScrollerDispatch = createContext(null)
export const SCROLLABLE = 'SCROLLABLE'
export const FIXED = 'FIXED'
export const VSCROLL = 'VSCROLL'
export const HSCROLL = 'HSCROLL'
export const INVALIDATE = 'INVALIDATE'

export const scrollerReducer = (state, action) => {
  log('scrollerReducer', 0, state, action)
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
    case VSCROLL: {
      const { scrollTop, scrolling } = action
      return scrolling
        ? { ...state, scrolling, scrollTop }
        : { ...state, scrolling: false }
    }
    case HSCROLL: {
      const { scrollLeft, scrolling } = action
      return scrolling
        ? { ...state, scrolling, scrollLeft }
        : { ...state, scrolling: false }
    }
    case INVALIDATE: {
      return { ...state }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
