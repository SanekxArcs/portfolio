'use client'
import {useSnowfallStore} from '@/lib/snowfallStore'
import {cn} from '@/lib/utils'
import Snowfall from 'react-snowfall'

export function SnowfallEffect() {
  const isEnabled = useSnowfallStore((state) => state.isEnabled)

  return (
    <div
      className={cn(
        isEnabled ? 'opacity-100' : 'opacity-0',
        'pointer-events-none transition-opacity duration-1000',
      )}
    >
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
        snowflakeCount={200}
        speed={[0.5, 1.5]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 3]}
        color="white"
      />
    </div>
  )
}
