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
import { DEFAULT_MIN_WIDTH } from './Table'

/**
 * Retrieve a property from an object
 * @param {object} obj The object to query
 * @param {string} path The path the the property
 * @param {*} defaultValue The value to return if the property is not present
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

/**
 * Default function to measure cells for column autoresizing
 * `<PagingType>`
 *
 * | Key        | Type             | Description                                                                        |
 * |------------|------------------|--------------------------|
 * | td         | `<element>`      | DOM element corresponding to the cell td   |
 * | row        | `<number>`       | Row index of the cell |
 * | metric     | `<MetricType>`   | Metric computed so far for the column |
 *
 * `<MetricType>`
 *
 * | Key        | Type             | Description                                                                        |
 * |------------|------------------|--------------------------|
 * | width      | `<number>`       | The max width of the column, so far. The function should alter this value |
 * | column     | `<ColumnType>`   | The column definition |
 * | index      | `<number>`       | The column index in its section |
 * | context    | `<CanvasRenderingContext2D>` | A canvas 2D context which can be used as a helper |
 *
 * @param {object} params parameters specifying which cell to resize
 */
export const measureCell = params => {
  // console.log('measureCell', params)
  const { td, metric, row } = params
  if (td) {
    const { context } = metric
    const cell = td.firstChild
    if (row === 0 && cell) {
      // Retrieve style of the first cell of the column an assume
      // all other cells with be styled in the same way
      const tdStyle = window.getComputedStyle(td)
      const cellStyle = window.getComputedStyle(cell)
      const { fontFamily, fontSize, fontWeight } = tdStyle
      metric.dx =
        parseInt(cellStyle.marginLeft) +
        parseInt(cellStyle.marginRight) +
        parseInt(cellStyle.paddingLeft) +
        parseInt(cellStyle.paddingRight) +
        parseInt(tdStyle.paddingLeft) +
        parseInt(tdStyle.paddingRight)
      const font = `${fontWeight} ${fontSize} ${fontFamily}`
      if (context.font !== font) {
        context.font = font
      }
    }
    if (cell) {
      const text = cell.textContent
      // console.log('text', text)
      const { width } = context.measureText(text)
      metric.width = Math.max(metric.width, width + metric.dx)
    }
  }
}

export const measureCols = (context, cols, section, rowIdAttr) => {
  if (section) {
    const metrics = cols.reduce(
      (acc, column, colIndex) => {
        const {
          autoresize,
          minWidth = DEFAULT_MIN_WIDTH,
          index,
          measure = measureCell
        } = column
        if (autoresize) {
          acc.push({
            column,
            index: index !== undefined ? index : colIndex,
            width: minWidth,
            context,
            measure
          })
        }
        return acc
      },
      [],
      {}
    )
    if (metrics.length > 0) {
      const body = section.lastChild
      if (body) {
        const rows = body.firstChild
        if (rows) {
          const dx = rowIdAttr ? 1 : 0
          metrics.forEach(metric => {
            const { index } = metric
            Array.prototype.forEach.call(
              rows.children,
              (rowElem, row) => {
                if (rowElem) {
                  const td = rowElem.children[index + dx]
                  if (td && td.classList.contains('rrt-td')) {
                    metric.measure({
                      td,
                      metric,
                      row
                    })
                  }
                }
              },
              metrics
            )
          })
        }
      }
    }
    return metrics
  }
  return null
}

export const LOGS = {}

export const log = (facility, severity, ...args) => {
  const sev = LOGS[facility]
  if (typeof sev === 'number' && severity >= sev) {
    console.log(facility, ...args)
  }
}
