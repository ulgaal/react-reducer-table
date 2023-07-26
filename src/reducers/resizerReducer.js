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
import { COLUMN_RESIZING } from '../actions'
import { LEVELS, log } from '../utils'

export const START_RESIZING = 'START_RESIZING'
export const RESIZE = 'RESIZE'
export const END_RESIZING = 'END_RESIZING'
export const ResizerContext = createContext(null)

export const resizerReducer = (state, action) => {
  log('resizerReducer', LEVELS.INFO, state, action)
  switch (action.type) {
    case START_RESIZING:
      return { ...state, barX: action.x, resizing: true }
    case RESIZE:
      return { ...state, barX: action.x }
    case END_RESIZING:
      state.dispatch({
        type: COLUMN_RESIZING,
        id: action.id,
        width: action.width
      })
      return { ...state, resizing: false }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}
