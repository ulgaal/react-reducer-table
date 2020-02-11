import { useRef } from 'react'

let counter = 0
export const useId = () => {
  const id = useRef(null)
  const nextId = () => counter++
  if (id.current === null) {
    id.current = nextId()
  }
  return id
}
