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
import React, { useReducer, useMemo, useEffect } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import { serverDecorator } from './decorators'

import docgen from './docgen'
import { generateMarkdown } from './generateMarkdown'
import BasicReadme from './md/basic.md'
import CompleteReadme from './md/complete.md'
import TooltipsReadme from './md/tooltips.md'
import AutoresizeReadme from './md/autoresize.md'
import FixedColsReadme from './md/fixedcols.md'
import { addReadme } from 'storybook-readme'
import faker from 'faker'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-resizable/css/styles.css'

import {
  COLUMN_REORDERING,
  COLUMN_RESIZING,
  PAGING,
  TableDispatch,
  Table
} from '../src'

import People from './people/People'
import Sellers from './people/Sellers'
import Users from './people/Users'

import './table.stories.css'
import { seq } from './people/utils'

const TableReadme = generateMarkdown('Table', docgen['src/Table.js'][0])

storiesOf('Tables', module)
  .addDecorator(addReadme)
  .addParameters({ options: { theme: {} } })
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
          default:
            return state
        }
      }

      // Define the initial state of your table
      const initialState = useMemo(
        () => ({
          columns: [
            {
              id: 'firstName',
              label: 'First name',
              sortable: false
            },
            {
              id: 'lastName',
              label: 'Last name',
              sortable: false
            }
          ],
          data: [
            { firstName: 'Neil', lastName: 'Armstrong' },
            { firstName: 'Buzz', lastName: 'Aldrin' },
            { firstName: 'Michael', lastName: 'Collins' }
          ]
        }),
        []
      )
      const [state, dispatch] = useReducer(tableReducer, initialState)
      return (
        <div className='simple-table'>
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
      decorators: [withKnobs, serverDecorator],
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
      decorators: [withKnobs, serverDecorator],
      readme: {
        content: TooltipsReadme,
        sidebar: TableReadme
      }
    }
  )
  .add(
    'Table with autosizing of first col',
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
          case PAGING: {
            const { pageIndex, pageSize } = action
            return {
              ...state,
              pageSize,
              pageIndex,
              data: models.slice(
                pageIndex * pageSize,
                (pageIndex + 1) * pageSize
              )
            }
          }
          default:
            return state
        }
      }

      // Define the initial state of your table
      const models = useMemo(() => {
        const { name } = faker
        return [...seq(0, 500)].map(index => ({
          firstName: [...seq(0, Math.ceil(5 * Math.random()))]
            .map(() => name.firstName())
            .join(' '),
          lastName: name.lastName()
        }))
      }, [])
      const initialState = useMemo(() => {
        const pageSize = 10
        return {
          columns: [
            {
              id: 'firstName',
              label: 'First name',
              sortable: false,
              autoresize: true,
              resizable: false
            },
            {
              id: 'lastName',
              label: 'Last name',
              sortable: false
            }
          ],
          pageIndex: 0,
          pageCount: models.length / pageSize,
          pageSize,
          data: models.slice(0, pageSize)
        }
      }, [])
      const [state, dispatch] = useReducer(tableReducer, initialState)
      return (
        <div className='autosize-table'>
          <TableDispatch.Provider value={dispatch}>
            <Table state={state} />
          </TableDispatch.Provider>
        </div>
      )
    },
    {
      readme: {
        content: AutoresizeReadme,
        sidebar: TableReadme
      }
    }
  )
  .add(
    'Table with fixed cols',
    () => {
      return (
        <div className='people-table'>
          <Users />
        </div>
      )
    },
    {
      decorators: [withKnobs, serverDecorator],
      readme: {
        content: FixedColsReadme,
        sidebar: TableReadme
      }
    }
  )
