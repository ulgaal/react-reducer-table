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
  useContext,
  useCallback
} from 'react'
import { Table, TableDispatch } from '../../src'
import { ServerContext } from '../decorators'
import { createDatabase } from './model'
import { tableReducer, LOADING, RESET } from './peopleReducer'
import Pagination from './Pagination'
import './People.css'
import ImageCell from './ImageCell'
import NameCell from './NameCell'
import CountryCell from './CountryCell'
import GenericCell from './GenericCell'
import AddressCell from './AddressCell'
import NameFilter from './NameFilter'
import CountryFilter from './CountryFilter'
import { FiltersContext } from './contexts'
import { UserControls } from './UserControls'
import ColumnChooser from './ColumnChooser'
import AddressTip from './AddressTip'
import { Storage, MergingConfigProvider, Pinnable } from '@ulgaal/react-infotip'
import './Users.css'

const columns = [
  {
    id: 'name',
    Cell: NameCell,
    label: 'Name',
    Filter: NameFilter,
    fixed: true
  },
  {
    id: 'username',
    Cell: GenericCell,
    label: 'User Name',
    fixed: true
  },
  {
    id: 'image',
    Cell: ImageCell,
    minWidth: 28,
    width: 28,
    sortable: false,
    resizable: false,
    label: 'Photo',
    fixed: true
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
    id: 'website',
    Cell: GenericCell,
    label: 'Web site',
    visible: false
  },
  {
    id: 'email',
    Cell: GenericCell,
    label: 'E-mail'
  },
  {
    id: 'company.name',
    Cell: GenericCell,
    label: 'Company'
  },
  {
    id: 'address.street',
    Cell: AddressCell,
    label: 'Street'
  },
  {
    id: 'address.suite',
    Cell: GenericCell,
    label: 'Suite'
  },
  {
    id: 'address.city',
    Cell: GenericCell,
    label: 'City'
  },
  {
    id: 'address.zipcode',
    Cell: GenericCell,
    label: 'Zip code'
  },
  {
    id: 'address.geo.lat',
    Cell: GenericCell,
    label: 'Lattitude'
  },
  {
    id: 'address.geo.lng',
    Cell: GenericCell,
    label: 'Longitude'
  }
]
export const tableInit = value => {
  // console.log('tableInit', value)
  return {
    columns: [...columns],
    selectedIds: new Set(),
    canDelete: false,
    ...value
  }
}

const Users = props => {
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
    query: '',
    displaySelectColumns: false,
    tips: []
  }
  const [state, dispatch] = useReducer(tableReducer, initialArg, tableInit)
  // console.log('Users', props, state)
  const {
    columns,
    pageIndex,
    pageSize,
    sort,
    filter,
    query,
    displaySelectColumns,
    tips
  } = state
  const config = useMemo(
    () => ({
      position: {
        container: '.users-table',
        target: 'mouse',
        adjust: {
          method: {
            flip: [
              'top-left',
              'center-left',
              'bottom-left',
              'top-right',
              'bottom-right'
            ]
          }
        }
      },
      show: {
        delay: 200
      },
      hide: {
        delay: 300
      },
      wrapper: Pinnable
    }),
    []
  )
  const { people } = database
  const handleTip = useCallback(
    (tipid, pinned) => {
      const [, id] = /address@(.+)/.exec(tipid) || []
      const { address } = people[id]
      return <AddressTip address={address} />
    },
    [people]
  )

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
    <div className='users-table'>
      <MergingConfigProvider value={config}>
        <Storage tips={tips} tip={handleTip}>
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
                    type: UserControls
                  }
                }}
              />
            </FiltersContext.Provider>
            {displaySelectColumns ? <ColumnChooser columns={columns} /> : null}
          </TableDispatch.Provider>
        </Storage>
      </MergingConfigProvider>
    </div>
  )
}

export default Users
