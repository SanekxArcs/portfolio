'use client'

import dynamic from 'next/dynamic'

const LightRays = dynamic(() => import('@/components/LightRays'), {ssr: false})
const SnowfallEffect = dynamic(
  () => import('@/components/snowfall').then((mod) => mod.SnowfallEffect),
  {ssr: false},
)
const AiChatWidgetWrapper = dynamic(
  () => import('@/components/ai-chat-widget-wrapper').then((mod) => mod.AiChatWidgetWrapper),
  {ssr: false},
)

export function VisualEffects() {
  return (
    <>
      <div className="mask-to-bottom pointer-events-none absolute inset-x-0 top-0 -z-10 h-screen overflow-hidden">
        <LightRays
          raysOrigin="top-center"
          raysColor="#00ffff"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
        <SnowfallEffect />
      </div>
      <AiChatWidgetWrapper />
    </>
  )
}
