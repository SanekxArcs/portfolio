import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Oleksandr Dzisiak - Portfolio'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(to bottom right, #022c22, #064e3b)',
          color: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 150,
              height: 150,
              background: '#059669',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 80,
              fontWeight: 'bold',
            }}
          >
            OD
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 80, fontWeight: 'bold' }}>Oleksandr Dzisiak</div>
            <div style={{ fontSize: 40, opacity: 0.8 }}>Full Stack Developer</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
