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
import { Storage, MergingConfigProvider, Pinnable } from '@ulgaal/react-infotip'
import { Table, TableDispatch } from '../../src'
import { ServerContext } from '../decorators'
import { createDatabase } from './model'
import { tableReducer, LOADING, RESET } from './peopleReducer'
import './Sellers.css'
import SellerCell from './SellerCell'
import GenericCell from './GenericCell'
import ProductsCell from './ProductsCell'
import SellerTip from './SellerTip'
import ProductTip from './ProductTip'
import NameFilter from './NameFilter'
import { FiltersContext } from './contexts'

export const tableInit = value => {
  // console.log('tableInit', value)
  return {
    columns: [
      {
        id: 'name',
        Cell: SellerCell,
        label: 'Name',
        Filter: NameFilter
      },
      {
        id: 'phone',
        Cell: GenericCell,
        label: 'Phone'
      },
      {
        id: 'products',
        Cell: ProductsCell,
        label: 'Products'
      }
    ],
    ...value
  }
}

const Sellers = props => {
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
    pageSize: 200,
    loading: false,
    sort: '+name',
    filter: null,
    query: '',
    tips: []
  }
  const [state, dispatch] = useReducer(tableReducer, initialArg, tableInit)
  // console.log('Sellers', props, state)
  const { pageIndex, pageSize, sort, filter, query } = state

  useEffect(() => {
    dispatch({ type: RESET, state: tableInit(initialArg) })
  }, [latency, dbsize])

  useEffect(() => {
    dispatch({
      type: LOADING,
      dispatch
    })
  }, [pageIndex, pageSize, sort, filter, query, database])

  const { people } = database
  const filters = useMemo(() => {
    return { query }
  }, [query])

  const handleTip = useCallback(
    (tipid, pinned) => {
      const [, kind, id] = /(prd|sel)@(.+)/.exec(tipid) || []
      if (kind === 'prd') {
        const [, sellerId, productId] = /(\d+)-(\d+)/.exec(id) || []
        const product = people[sellerId].products[productId]
        return <ProductTip product={product} />
      } else if (kind === 'sel') {
        return <SellerTip seller={people[id]} />
      }
    },
    [people]
  )
  const config = useMemo(
    () => ({
      position: {
        container: '.people-table',
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
  return (
    <div className='sellers'>
      <MergingConfigProvider value={config}>
        <Storage tips={state.tips} tip={handleTip}>
          <TableDispatch.Provider value={dispatch}>
            <FiltersContext.Provider value={filters}>
              <Table state={state} />
            </FiltersContext.Provider>
          </TableDispatch.Provider>
        </Storage>
      </MergingConfigProvider>
    </div>
  )
}

export default Sellers
