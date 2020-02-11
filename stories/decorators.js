/*
Copyright 2019 Ulrich Gaal

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
import React from 'react'
import { number } from '@storybook/addon-knobs'

export const SERVER_GROUP = 'Server'

export const ServerContext = React.createContext()

export const serverDecorator = story => {
  const serverProps = {
    dbsize: number(
      'Database size',
      1800,
      {
        range: true,
        min: 100,
        max: 10000,
        step: 100
      },
      SERVER_GROUP
    ),
    latency: number(
      'Latency in ms',
      0,
      {
        range: true,
        min: 0,
        max: 5000,
        step: 100
      },
      SERVER_GROUP
    )
  }
  return (
    <ServerContext.Provider value={serverProps}>
      {story()}
    </ServerContext.Provider>
  )
}
