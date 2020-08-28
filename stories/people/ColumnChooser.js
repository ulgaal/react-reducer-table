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
import React, { useContext, useCallback, useReducer } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import ExtendedModalDialog from './ExtendedModalDialog'
import { TableDispatch, ColumnsType } from '../../src'
import {
  CHOOSE_COLUMNS_OK,
  CHOOSE_COLUMNS_APPLY,
  CHOOSE_COLUMNS_CANCEL
} from './peopleReducer'
import './ColumnChooser.css'

const SELECT_COLUMNS = 'SELECT_COLUMNS'
const POSITION = 'POSITION'
const RESIZE = 'RESIZE'

const chooserReducer = (state, action) => {
  // console.log('chooserReducer', state, action)
  const { type } = action
  switch (type) {
    case SELECT_COLUMNS: {
      const { visible } = action
      return { ...state, visible }
    }
    case POSITION: {
      const { position } = action
      return { ...state, position }
    }
    case RESIZE: {
      const { size } = action
      return { ...state, size }
    }
    default:
      throw new Error(`Unknown action: ${action.type}`)
  }
}

const defaultSize = { width: 500, height: 370 }

const ColumnChooser = props => {
  // console.log("ColumnChooser", props)
  const dispatch = useContext(TableDispatch)

  const [state, chooserDispatch] = useReducer(chooserReducer, {
    columns: props.columns,
    visible: new Set(props.visible.map(({ id }) => id)),
    position: { x: 0, y: 0 },
    size: defaultSize
  })
  const { columns, visible, position, size } = state
  const showColumn = useCallback(
    id => {
      const newVisible = new Set(
        visible.has(id)
          ? [...visible].filter(colid => colid !== id)
          : [...visible, id]
      )
      chooserDispatch({
        type: SELECT_COLUMNS,
        visible: newVisible
      })
    },
    [visible]
  )

  const handleSelectAll = useCallback(() => {
    chooserDispatch({
      type: SELECT_COLUMNS,
      visible: new Set(columns.map(({ id }) => id))
    })
  }, [columns])

  const handleDeselectAll = useCallback(() => {
    chooserDispatch({
      type: SELECT_COLUMNS,
      visible: new Set()
    })
  }, [columns])

  const handleStop = useCallback((event, data) => {
    chooserDispatch({
      type: POSITION,
      position: { x: data.x, y: data.y }
    })
  }, [])

  const handleResize = useCallback((event, { size: { width, height } }) => {
    chooserDispatch({
      type: RESIZE,
      size: { width, height }
    })
  }, [])

  return (
    <ExtendedModalDialog
      width={size.width}
      height={size.height}
      minConstraints={[defaultSize.width, defaultSize.height]}
      position={position}
      onStop={handleStop}
      onResize={handleResize}
    >
      <Modal.Header
        closeButton
        onHide={() => {
          dispatch({ type: CHOOSE_COLUMNS_CANCEL })
        }}
      >
        <Modal.Title>Select columns...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='column-chooser'>
          <div className='column-chooser-instructions'>
            Select the columns to be displayed
          </div>
          <div className='column-chooser-sel-btns'>
            <Button onClick={handleSelectAll}>Select all</Button>
            <Button onClick={handleDeselectAll}>Deselect all</Button>
          </div>
          <div className='column-chooser-cols'>
            {columns.map(({ id, label }, index) => (
              <Form.Check
                key={index}
                checked={visible.has(id)}
                onChange={() => {
                  showColumn(id)
                }}
                label={label}
              />
            ))}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            dispatch({
              type: CHOOSE_COLUMNS_OK,
              columns: columns.filter(({ id }) => visible.has(id))
            })
          }}
        >
          Ok
        </Button>
        <Button
          onClick={() => {
            dispatch({ type: CHOOSE_COLUMNS_CANCEL })
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            dispatch({
              type: CHOOSE_COLUMNS_APPLY,
              columns: columns.filter(({ id }) => visible.has(id))
            })
          }}
        >
          Apply
        </Button>
      </Modal.Footer>
    </ExtendedModalDialog>
  )
}

ColumnChooser.propTypes = {
  columns: ColumnsType,
  visible: ColumnsType
}

export default ColumnChooser
