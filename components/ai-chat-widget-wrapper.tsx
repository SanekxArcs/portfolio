'use client'

import dynamic from 'next/dynamic'

const AiChatWidget = dynamic(
  () => import('@/components/ai-chat-widget').then((m) => ({default: m.AiChatWidget})),
  {ssr: false},
)

export function AiChatWidgetWrapper() {
  return <AiChatWidget />
}
