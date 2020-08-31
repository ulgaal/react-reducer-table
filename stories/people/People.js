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
import React, {
  useRef,
  useEffect,
  useReducer,
  useMemo,
  useContext
} from 'react'
import { Table, TableDispatch } from '../../src'
import { ServerContext } from '../decorators'
import { createDatabase } from './model'
import { tableReducer, LOADING, RESET } from './peopleReducer'
import Pagination from './Pagination'
import { PeopleControls } from './PeopleControls'
import { FiltersContext } from './contexts'
import ImageCell from './ImageCell'
import NameCell from './NameCell'
import CountryCell from './CountryCell'
import GenericCell from './GenericCell'
import NameFilter from './NameFilter'
import CountryFilter from './CountryFilter'
import './People.css'

export const tableInit = value => {
  // console.log('tableInit', value)
  return {
    columns: [
      {
        id: 'name',
        Cell: NameCell,
        label: 'Name',
        Filter: NameFilter
      },
      {
        id: 'image',
        Cell: ImageCell,
        minWidth: 28,
        width: 28,
        sortable: false,
        resizable: false,
        label: 'Photo'
      },
      {
        id: 'country',
        Cell: CountryCell,
        label: 'Country',
        Filter: CountryFilter
      },
      {
        id: 'phone',
        Cell: GenericCell,
        label: 'Phone'
      },
      {
        id: 'email',
        Cell: GenericCell,
        label: 'E-mail'
      }
    ],
    selectedIds: new Set(),
    canDelete: false,
    ...value
  }
}

const People = props => {
  const { latency, dbsize } = useContext(ServerContext)
  const fetchIdRef = useRef(0)
  const database = useMemo(() => createDatabase(dbsize), [dbsize])
  const initialArg = {
    fetchIdRef,
    latency,
    database,
    data: [],
    total: 0,
    pageIndex: 0,
    pageCount: 0,
    pageSize: 100,
    loading: false,
    sort: '+name',
    filter: null,
    query: ''
  }
  const [state, dispatch] = useReducer(tableReducer, initialArg, tableInit)
  // console.log('People', props, state)
  const { pageIndex, pageSize, sort, filter, query, canDelete } = state

  useEffect(() => {
    dispatch({ type: RESET, state: tableInit(initialArg) })
  }, [latency, dbsize])

  useEffect(() => {
    dispatch({
      type: LOADING,
      dispatch
    })
  }, [pageIndex, pageSize, sort, filter, query, database])

  const { countries } = database
  const filters = useMemo(() => {
    return { filter, query, countries }
  }, [filter, query, countries])

  return (
    <TableDispatch.Provider value={dispatch}>
      <FiltersContext.Provider value={filters}>
        <Table
          state={state}
          rowIdAttr='name'
          labels={{
            toggle: 'Toggle people selected',
            toggleAll: 'Toggle all people selected'
          }}
          components={{
            pagination: {
              type: Pagination,
              props: {
                pageSizes: [10, 20, 30, 50, 100, 200, 300, 500]
              }
            },
            paginationExtra: {
              type: PeopleControls,
              props: { canDelete }
            }
          }}
        />
      </FiltersContext.Provider>
    </TableDispatch.Provider>
  )
}

export default People
