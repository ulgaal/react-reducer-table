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
/**
 * A sequence generator function
 */
export function * seq (start, end) {
  if (start < end) {
    for (let current = start; current < end; current++) {
      yield current
    }
  } else {
    for (let current = start; current > end; current--) {
      yield current
    }
  }
}
export const delayedRun = (f, delay) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(f())
    }, delay)
  })

export const eqSet = (as, bs) => {
  if (!as) {
    return !bs
  } else if (!bs) {
    return !as
  }
  if (as.size !== bs.size) return false
  for (const a of as) if (!bs.has(a)) return false
  return true
}

export const eqArray = (aa, ab, prop) => {
  if (aa.length !== ab.length) return false
  for (let i = 0, len = aa.length; i < len; i++) {
    if (aa[prop] !== ab[prop]) return false
  }
  return true
}

export const compareStrings = (a, b) => {
  return a.localeCompare(b)
}

export const regexpify = str =>
  new RegExp(
    `(${str.replace(
      new RegExp('\\*|\\?|\\.', 'g'),
      match => ({ '*': '.*', '?': '.', '.': '\\.' }[match])
    )})`,
    'ig'
  )

export const highlight = (search, value) => {
  const matches = []
  if (typeof search === 'string' && search) {
    const regexp = regexpify(search)
    let match
    while ((match = regexp.exec(value)) !== null) {
      matches.push({ start: match.index, end: regexp.lastIndex })
    }
  }
  const spans = matches.reduce((spans, { start, end }, index, matches) => {
    if (index === 0) {
      if (start > 0) {
        spans.push({ text: value.substring(0, start), highlight: false })
      }
    } else {
      const prevEnd = matches[index - 1].end
      if (prevEnd !== start) {
        spans.push({ text: value.substring(prevEnd, start), highlight: false })
      }
    }

    spans.push({ text: value.substring(start, end), highlight: true })

    if (index === matches.length - 1) {
      if (end !== value.length) {
        spans.push({
          text: value.substring(end, value.length),
          highlight: false
        })
      }
    }
    return spans
  }, [])
  return spans.length ? spans : [{ text: value, highlight: false }]
}
