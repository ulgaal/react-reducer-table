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
import React, { useContext } from 'react'
import './Empty.css'
import { ConfigContext } from './Table'

const Empty = props => {
  const { labels } = useContext(ConfigContext)
  return (
    <div className='rrt-empty'>
      <div className='rrt-empty-message'>
        <span>{labels.noData}</span>
      </div>
    </div>
  )
}

Empty.displayName = 'Empty'

export default React.memo(Empty)
