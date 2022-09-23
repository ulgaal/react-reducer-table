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
import { ConfigContext } from './Table'
import './Loading.css'

const Loading = props => {
  const { labels } = useContext(ConfigContext)
  return (
    <div className='rrt-loading'>
      <div className='rrt-loading-mask' />
      <div className='rrt-loading-progress'>
        <span>{labels.loading}</span>
      </div>
    </div>
  )
}

Loading.displayName = 'Loading'

export default Loading
