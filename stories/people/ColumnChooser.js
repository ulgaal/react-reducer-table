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
      const { columns } = action
      return { ...state, columns }
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
    columns: props.columns.map(col => ({ ...col })),
    position: { x: 0, y: 0 },
    size: defaultSize
  })
  const { columns, position, size } = state
  const visibleCount = columns.reduce((acc, { visible }) => {
    return acc + visible !== false ? 1 : 0
  }, 0)
  const showColumn = useCallback(
    index => {
      const column = columns[index]
      const newColumns = [...columns]
      newColumns[index] = {
        ...column,
        visible: column.visible === false
      }
      chooserDispatch({
        type: SELECT_COLUMNS,
        columns: newColumns
      })
    },
    [columns]
  )

  const handleSelectAll = useCallback(() => {
    chooserDispatch({
      type: SELECT_COLUMNS,
      columns: [...columns.map(col => ({ ...col, visible: true }))]
    })
  }, [columns])

  const handleDeselectAll = useCallback(() => {
    chooserDispatch({
      type: SELECT_COLUMNS,
      columns: [...columns.map(col => ({ ...col, visible: false }))]
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
            {columns.map(({ id, label, visible }, index) => (
              <Form.Check
                key={index}
                checked={visible !== false}
                onChange={() => {
                  showColumn(index)
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
              columns
            })
          }}
          disabled={visibleCount === 0}
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
              columns
            })
          }}
          disabled={visibleCount === 0}
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
