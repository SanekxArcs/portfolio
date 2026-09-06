'use client'
import dynamic from 'next/dynamic'

import {isWinterSeason, useSnowfallStore} from '@/lib/snowfallStore'
import {useUIStore} from '@/hooks/use-ui-store'

const Snowfall = dynamic(() => import('react-snowfall'), {ssr: false})

export function SnowfallEffect() {
  const isEnabled = useSnowfallStore((state) => state.isEnabled)
  const isReducedMotion = useUIStore((state) => state.isReducedMotion)

  if (isReducedMotion || !isEnabled || !isWinterSeason()) return null

  return (
    <div className="pointer-events-none">
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
        snowflakeCount={60}
        speed={[0.5, 1.5]}
        wind={[-0.5, 0.5]}
        radius={[0.5, 3]}
        color="white"
      />
    </div>
  )
}
