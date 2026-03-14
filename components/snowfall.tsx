'use client'
import Snowfall from 'react-snowfall'

import {useSnowfallStore} from '@/lib/snowfallStore'

export function SnowfallEffect() {
  const isEnabled = useSnowfallStore((state) => state.isEnabled)

  if (!isEnabled) return null

  return (
    <Snowfall
      style={{
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
      snowflakeCount={150} // reduced from 200 to lower CPU/GPU usage
      speed={[0.5, 1.5]}
      wind={[-0.5, 0.5]}
      radius={[0.5, 3]}
      color="white"
    />
  )
}
