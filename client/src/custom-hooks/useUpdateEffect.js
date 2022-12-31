import { useEffect, useRef } from "react"

export default function useUpdateEffect(callback, dependencies) {
  const firstRenderRef = useRef(false)

  useEffect(() => {
    if (firstRenderRef.current) {
      return callback()
    } else {
      firstRenderRef.current = true
    }
  }, dependencies)

  useEffect(() => {
    return () => {
      firstRenderRef.current = false
    }
  }, [])
}
