'use client'
import dynamic from 'next/dynamic'

// Defers ogl + shader setup out of the initial bundle; renders nothing on the server.
const LightRaysLazy = dynamic(() => import('@/components/LightRays'), {ssr: false})

export default LightRaysLazy
