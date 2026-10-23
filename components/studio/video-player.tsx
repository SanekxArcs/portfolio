'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {Maximize, Minimize, Pause, Play, RotateCcw, Volume2, VolumeX} from 'lucide-react'
import type {Dictionary} from '@/lib/i18n/dictionaries'
import {useStudioReducedMotion} from './motion-text'

const IDLE_MS = 2200
const SEEK_STEP = 5

const clock = (seconds: number) => {
  if (!Number.isFinite(seconds)) return '0:00'
  const whole = Math.max(0, Math.floor(seconds))
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`
}

/**
 * The project demo player: poster with one large play action, then a quiet control bar that
 * hides while the video plays and the pointer rests. Progress paints every frame through a
 * CSS variable, so scrubbing and playback stay smooth without re-rendering React.
 */
export function VideoPlayer({
  src,
  poster,
  title,
  d,
}: {
  src: string
  poster?: string | null
  title?: string | null
  d: Dictionary
}) {
  const frameRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = useStudioReducedMotion()
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [ended, setEnded] = useState(false)
  const [muted, setMuted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [idle, setIdle] = useState(false)
  const [time, setTime] = useState({current: 0, duration: 0})
  const idleTimer = useRef(0)
  const scrubbing = useRef(false)
  const p = d.player

  const paint = useCallback(() => {
    const video = videoRef.current,
      frame = frameRef.current
    if (!video || !frame) return
    const duration = video.duration || 0
    const played = duration ? video.currentTime / duration : 0
    const buffered =
      duration && video.buffered.length
        ? video.buffered.end(video.buffered.length - 1) / duration
        : 0
    frame.style.setProperty('--played', played.toFixed(4))
    frame.style.setProperty('--buffered', buffered.toFixed(4))
  }, [])

  // While playing, paint progress every frame; time text updates on the media events.
  useEffect(() => {
    if (!playing) return
    let frame = 0
    const loop = () => {
      paint()
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [playing, paint])

  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === frameRef.current)
    document.addEventListener('fullscreenchange', change)
    return () => document.removeEventListener('fullscreenchange', change)
  }, [])

  useEffect(() => () => window.clearTimeout(idleTimer.current), [])

  const wake = () => {
    setIdle(false)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setIdle(true), IDLE_MS)
  }

  const toggle = () => {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    if (video.paused || video.ended) void video.play().catch(() => {})
    else video.pause()
    wake()
  }

  const seekTo = (seconds: number) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    video.currentTime = Math.min(video.duration, Math.max(0, seconds))
    setEnded(false)
    paint()
    setTime({current: video.currentTime, duration: video.duration})
  }

  const seekFromPointer = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current,
      video = videoRef.current
    if (!track || !video?.duration) return
    const box = track.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width))
    seekTo(ratio * video.duration)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const toggleFullscreen = () => {
    const frame = frameRef.current,
      video = videoRef.current as (HTMLVideoElement & {webkitEnterFullscreen?: () => void}) | null
    if (!frame || !video) return
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {})
    else if (frame.requestFullscreen) void frame.requestFullscreen().catch(() => {})
    else video.webkitEnterFullscreen?.()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    const onControl = (event.target as HTMLElement).closest('button, [role="slider"]')
    const video = videoRef.current
    if (!video) return
    if ((event.key === ' ' || event.key === 'k') && !onControl) {
      event.preventDefault()
      toggle()
    } else if (event.key === 'm') toggleMute()
    else if (event.key === 'f') toggleFullscreen()
    else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault()
      seekTo(video.currentTime + (event.key === 'ArrowRight' ? SEEK_STEP : -SEEK_STEP))
    } else return
    wake()
  }

  const PlayIcon = ended ? RotateCcw : playing ? Pause : Play
  const playLabel = ended ? p.replay : playing ? p.pause : p.play

  return (
    <figure
      ref={frameRef}
      className="video-player"
      data-started={started}
      data-playing={playing}
      data-idle={idle && playing}
      data-reduced={reduced}
      onPointerMove={wake}
      onKeyDown={onKeyDown}
      onFocus={wake}
    >
      <video
        ref={videoRef}
        playsInline
        preload="metadata"
        poster={poster ?? undefined}
        aria-label={title ? `${d.work.watchDemo} — ${title}` : d.work.watchDemo}
        onClick={toggle}
        onPlay={() => {
          setPlaying(true)
          setEnded(false)
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false)
          setEnded(true)
          setIdle(false)
          paint()
        }}
        onLoadedMetadata={(event) =>
          setTime({current: 0, duration: event.currentTarget.duration})
        }
        onTimeUpdate={(event) => {
          if (!scrubbing.current)
            setTime({
              current: event.currentTarget.currentTime,
              duration: event.currentTarget.duration,
            })
        }}
        onProgress={paint}
      >
        <source src={src} type="video/mp4" />
        <a href={src}>{d.work.watchDemo}</a>
      </video>

      {!started && (
        <button type="button" className="video-start" onClick={toggle}>
          <span className="video-start-icon" aria-hidden="true">
            <Play size={22} fill="currentColor" />
          </span>
          {d.work.watchDemo}
        </button>
      )}

      <div className="video-controls" hidden={!started}>
        <button
          type="button"
          className="video-control"
          onClick={toggle}
          aria-label={playLabel}
          title={playLabel}
        >
          <PlayIcon size={20} fill={playing || ended ? 'none' : 'currentColor'} />
        </button>
        <div
          ref={trackRef}
          className="video-track"
          role="slider"
          tabIndex={0}
          aria-label={p.seek}
          aria-valuemin={0}
          aria-valuemax={Math.round(time.duration) || 0}
          aria-valuenow={Math.round(time.current)}
          aria-valuetext={`${clock(time.current)} ${p.of} ${clock(time.duration)}`}
          onPointerDown={(event) => {
            scrubbing.current = true
            event.currentTarget.setPointerCapture(event.pointerId)
            seekFromPointer(event)
          }}
          onPointerMove={(event) => {
            if (scrubbing.current) seekFromPointer(event)
          }}
          onPointerUp={() => {
            scrubbing.current = false
          }}
          onPointerCancel={() => {
            scrubbing.current = false
          }}
        >
          <span className="video-track-rail" aria-hidden="true">
            <span className="video-track-buffered" />
            <span className="video-track-played" />
          </span>
          <span className="video-track-thumb-lane" aria-hidden="true">
            <span className="video-track-thumb" />
          </span>
        </div>
        <span className="video-time">
          <time>{clock(time.current)}</time>
          <span aria-hidden="true">/</span>
          <time>{clock(time.duration)}</time>
        </span>
        <button
          type="button"
          className="video-control"
          onClick={toggleMute}
          aria-label={muted ? p.unmute : p.mute}
          title={muted ? p.unmute : p.mute}
          aria-pressed={muted}
        >
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button
          type="button"
          className="video-control"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? p.exitFullscreen : p.fullscreen}
          title={fullscreen ? p.exitFullscreen : p.fullscreen}
        >
          {fullscreen ? <Minimize size={19} /> : <Maximize size={19} />}
        </button>
      </div>
    </figure>
  )
}
