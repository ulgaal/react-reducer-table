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
import React, { useReducer } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { serverDecorator } from './decorators'

import docgen from './docgen'
import { generateMarkdown } from './generateMarkdown'
import BasicReadme from './md/basic.md'
import CompleteReadme from './md/complete.md'
import TooltipsReadme from './md/tooltips.md'
import { addReadme } from 'storybook-readme'

import {
  COLUMN_REORDERING,
  COLUMN_RESIZING,
  TableDispatch,
  Table
} from '../src'

import People from './people/People'
import Sellers from './people/Sellers'

import './table.stories.css'

const TableReadme = generateMarkdown('Table', docgen['src/Table.js'][0])

storiesOf('Tables', module)
  .addDecorator(addReadme)
  .addParameters({ options: { theme: {} } })
  .addDecorator(withKnobs)
  .addDecorator(serverDecorator)
  .add(
    'Basic table with column reordering and resizing',
    () => {
      const tableReducer = (state, action) => {
        switch (action.type) {
          case COLUMN_REORDERING:
            return { ...state, columns: action.columns }
          case COLUMN_RESIZING:
            return {
              ...state,
              columns: state.columns.map(column =>
                column.id === action.id
                  ? { ...column, width: action.width }
                  : column
              )
            }
        }
      }

      // Define the initial state of your table
      const initialState = {
        columns: [
          {
            id: 'firstName',
            label: 'First name'
          },
          {
            id: 'lastName',
            label: 'Last name'
          }
        ],
        data: [
          { firstName: 'Neil', lastName: 'Armstrong' },
          { firstName: 'Buzz', lastName: 'Aldrin' },
          { firstName: 'Michael', lastName: 'Collins' }
        ]
      }
      const [state, dispatch] = useReducer(tableReducer, initialState)
      return (
        <div className='people-table'>
          <TableDispatch.Provider value={dispatch}>
            <Table state={state} />
          </TableDispatch.Provider>
        </div>
      )
    },
    {
      readme: {
        content: BasicReadme,
        sidebar: TableReadme
      }
    }
  )
  .add(
    'Table with filters, sorting, selection, custom pagination',
    () => {
      return (
        <div className='people-table'>
          <People />
        </div>
      )
    },
    {
      readme: {
        content: CompleteReadme,
        sidebar: TableReadme
      }
    }
  )
  .add(
    'Table with tooltips',
    () => {
      return (
        <div className='people-table'>
          <Sellers />
        </div>
      )
    },
    {
      readme: {
        content: TooltipsReadme,
        sidebar: TableReadme
      }
    }
  )
