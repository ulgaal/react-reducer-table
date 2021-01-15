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
import faker from 'faker'
import { seq, compareStrings } from './utils'

const { helpers, address, commerce } = faker
export const createDatabase = dbsize => {
  const people = [...seq(0, dbsize)].map(id => ({
    id,
    ...helpers.userCard(),
    country: address.country(),
    // replaced internet.avatar which does not work any more
    // with a 9x15 mosaic of ai generated people faces
    image: Math.floor(135 * Math.random()),
    products: [...seq(0, 1 + Math.floor(20 * Math.random()))].map(
      productId => ({
        id: `${id}-${productId}`,
        color: commerce.color(),
        department: commerce.department(),
        productName: commerce.productName(),
        price: commerce.price(),
        product: commerce.product()
      })
    )
  }))
  const countries = [
    ...people.reduce((acc, { country }) => {
      return acc.add(country)
    }, new Set())
  ].sort(compareStrings)
  const database = {
    people,
    countries
  }
  console.log('createDatabase', database)
  return database
}
