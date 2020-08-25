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
export const getProperty = (obj, path, defaultValue = null) =>
  (path || '').split('.').reduce((obj, prop, index, array) => {
    if (obj) {
      const [, key, item] = /([^[]*)(.*)/.exec(prop)
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (item) {
          const [, index] = /\[(\d+)\]/.exec(item)
          return obj[key][index]
        } else {
          return obj[key]
        }
      }
    }
    return index === array.length - 1 ? defaultValue : null
  }, obj)

/**
 * Replaces params of the form ${k} in a string with values supplied from a hash {k: v}
 */
export const subst = params => {
  // console.log('subst', params)
  const { tpl, data, encode = false } = params
  const repl = object => x => {
    const k = x.substring(2, x.length - 1)
    const v = getProperty(object, k)
    return encode ? encodeURIComponent(v) : v
  }
  return tpl.replace(/\${[^}]+}/g, repl(data))
}
