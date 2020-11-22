import { useEffect, useMemo, useRef } from 'react'
import { store, getDataFromSchema, useValuesForPath } from './store'
import { folder } from './helpers/folder'
import { ValueInput } from './types'
import { register } from './register'

import number from './components/Number'
import color from './components/Color'
import string from './components/String'
import boolean from './components/Boolean'
import point3d from './components/Point3d'
import point2d from './components/Point2d'
import spring from './components/Spring'

register(number, 'NUMBER')
register(color, 'COLOR')
register(string, 'STRING')
register(boolean, 'BOOLEAN')
register(point3d, 'POINT3D')
register(point2d, 'POINT2D')
register(spring, 'SPRING')

// TODO fix name type
// @ts-expect-error
export function useTwix(nameOrInput: string | ValueInput, ...args) {
  const _name = typeof nameOrInput === 'string' ? nameOrInput : undefined
  const schema = useRef(_name ? folder(_name, args) : [nameOrInput, ...args])
  const initialData = useMemo(() => getDataFromSchema(schema.current), [])
  const paths = useMemo(() => Object.keys(initialData), [initialData])
  const values = useValuesForPath(paths, initialData)

  useEffect(() => {
    store.setData(initialData)
    return () => store.disposePaths(paths)
  }, [paths, initialData])

  return values
}
