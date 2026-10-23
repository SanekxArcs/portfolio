'use client'

import {AnimatePresence, motion} from 'motion/react'
import {MotionSize} from './motion-size'
import {smoothEase, useStudioReducedMotion} from './motion-text'

import {MotionText} from '@/components/studio/motion-text'

import {useState, type FormEvent} from 'react'
import {Check, Copy} from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {Dictionary} from '@/lib/i18n/dictionaries'

// Volatile tab memory only: keep a brief while switching language, never persist contact details.
const unsentFields: Record<string, string> = {}

export function EnquiryForm({
  d,
  email,
  initialMode,
  initialService,
}: {
  d: Dictionary
  email: string
  initialMode: 'project' | 'hiring'
  initialService: string
}) {
  const [fields, setFields] = useState(() => ({...unsentFields}))
  const [mode, setMode] = useState(initialMode)
  const reduced = useStudioReducedMotion()
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<{subject: string; body: string} | null>(
    null,
  )
  const [copyStatus, setCopyStatus] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = (key: string) => String(data.get(key) || '').trim()
    if (
      !value('name') ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value('email')) ||
      !value('brief')
    ) {
      setError(d.contact.invalid)
      return
    }
    setError('')
    const subject =
      mode === 'project' ? d.contact.subjectProject : d.contact.subjectHiring
    const body = `${d.contact.name}: ${value('name')}\n${d.contact.email}: ${value('email')}\n${d.contact.type}: ${mode === 'hiring' ? d.contact.roleType : value('type')}\n\n${value('brief')}\n\n${d.contact.budget}: ${value('budget') || d.contact.unknown}\n${d.contact.timeline}: ${value('timeline') || d.contact.unknown}`
    setDraft({subject, body})
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  return (
    <div className="enquiry-panel">
      <div className="enquiry-modes" role="group" aria-label={d.contact.type}>
        {(['project', 'hiring'] as const).map((value) => (
          <motion.button
            layout
            key={value}
            type="button"
            aria-pressed={mode === value}
            onClick={() => {
              setMode(value)
              setError('')
              setDraft(null)
              const url = new URL(window.location.href)
              url.searchParams.set('intent', value)
              window.history.replaceState(null, '', url)
            }}
          >
            {mode === value && (
              <motion.span
                className="motion-tab-indicator"
                layoutId="enquiry-mode-indicator"
                transition={{duration: reduced ? 0 : 0.32, ease: smoothEase}}
              />
            )}
            <span className="motion-tab-label">
              <MotionText text={d.contact[value]} />
            </span>
          </motion.button>
        ))}
      </div>
      <MotionSize>
        <AnimatePresence initial={false} mode="popLayout">
          {!draft && (
            <motion.form
              key="form"
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: reduced ? 0 : 0.2, ease: smoothEase}}
              onSubmit={submit}
              noValidate
              onChange={(event) => {
                const target = event.target
                if (
                  (target instanceof HTMLInputElement ||
                    target instanceof HTMLSelectElement ||
                    target instanceof HTMLTextAreaElement) &&
                  target.name
                ) {
                  const value =
                    target.name === 'type'
                      ? (d.services.items.find(
                          (item) => item.title === target.value,
                        )?.id ?? 'other')
                      : target.value
                  unsentFields[target.name] = value
                  setFields((previous) => ({...previous, [target.name]: value}))
                }
              }}
            >
              <div className="enquiry-row">
                <label>
                  <MotionText text={d.contact.name} />
                  <input
                    name="name"
                    aria-label={d.contact.name}
                    defaultValue={fields.name ?? ''}
                    autoComplete="name"
                    required
                    maxLength={100}
                    aria-describedby={error ? 'enquiry-error' : undefined}
                  />
                </label>
                <label>
                  <MotionText text={d.contact.email} />
                  <input
                    name="email"
                    aria-label={d.contact.email}
                    defaultValue={fields.email ?? ''}
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    aria-describedby={error ? 'enquiry-error' : undefined}
                  />
                </label>
              </div>
              <AnimatePresence initial={false}>
                {mode === 'project' && (
                  <motion.div
                    key="service"
                    initial={{height: 0, opacity: 0}}
                    animate={{height: 'auto', opacity: 1}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: reduced ? 0 : 0.3, ease: smoothEase}}
                    style={{overflow: 'clip', overflowClipMargin: '8px'}}
                  >
                    <label>
                      <MotionText text={d.contact.type} />
                      <Select
                        name="type"
                        items={[
                          ...d.services.items.map((item) => ({
                            value: item.title,
                            label: item.title,
                          })),
                          {
                            value: d.contact.otherType,
                            label: d.contact.otherType,
                          },
                        ]}
                        value={
                          (fields.type === 'other'
                            ? d.contact.otherType
                            : d.services.items.find(
                                (item) => item.id === fields.type,
                              )?.title) ||
                          (d.services.items.find(
                            (item) => item.id === initialService,
                          )?.title ??
                            d.services.items[0].title)
                        }
                        onValueChange={(value) => {
                          if (!value) return
                          const id =
                            d.services.items.find(
                              (item) => item.title === value,
                            )?.id ?? 'other'
                          unsentFields.type = id
                          setFields((previous) => ({...previous, type: id}))
                        }}
                      >
                        <SelectTrigger
                          className="enquiry-select-trigger"
                          aria-label={d.contact.type}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className="enquiry-select-popup"
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {d.services.items.map((item) => (
                            <SelectItem
                              key={item.id}
                              value={item.title}
                              className="enquiry-select-option"
                            >
                              {item.title}
                            </SelectItem>
                          ))}
                          <SelectItem
                            value={d.contact.otherType}
                            className="enquiry-select-option"
                          >
                            {d.contact.otherType}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>
              <label>
                <MotionText text={d.contact.brief} />
                <textarea
                  name="brief"
                  aria-label={d.contact.brief}
                  defaultValue={fields.brief ?? ''}
                  required
                  rows={5}
                  maxLength={3000}
                  placeholder={
                    mode === 'project'
                      ? d.contact.briefProject
                      : d.contact.briefHiring
                  }
                  aria-describedby={error ? 'enquiry-error' : undefined}
                />
              </label>
              <div className="enquiry-row">
                <label>
                  <MotionText text={d.contact.budget} />
                  <input
                    name="budget"
                    aria-label={d.contact.budget}
                    defaultValue={fields.budget ?? ''}
                    maxLength={100}
                    placeholder={d.contact.unknown}
                  />
                </label>
                <label>
                  <MotionText text={d.contact.timeline} />
                  <input
                    name="timeline"
                    aria-label={d.contact.timeline}
                    defaultValue={fields.timeline ?? ''}
                    maxLength={100}
                    placeholder={d.contact.unknown}
                  />
                </label>
              </div>
              <AnimatePresence initial={false}>
                {error && (
                  <motion.p
                    initial={{height: 0, opacity: 0, y: -5}}
                    animate={{height: 'auto', opacity: 1, y: 0}}
                    exit={{height: 0, opacity: 0}}
                    transition={{duration: reduced ? 0 : 0.25}}
                    className="enquiry-error"
                    id="enquiry-error"
                    role="alert"
                  >
                    <MotionText text={error} />
                  </motion.p>
                )}
              </AnimatePresence>
              <button className="studio-button primary" type="submit">
                <MotionText text={d.contact.submit} />
              </button>
              <p className="enquiry-note">
                <MotionText text={d.contact.note} />
              </p>
            </motion.form>
          )}
          {draft && (
            <motion.div
              className="enquiry-draft"
              key="draft"
              initial={{opacity: 0, y: 8}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -6}}
              transition={{duration: reduced ? 0 : 0.25, ease: smoothEase}}
            >
              <p role="status">
                <Check size={18} />
                <MotionText text={d.contact.ready} />
              </p>
              <h2>
                <MotionText text={d.contact.preview} />
              </h2>
              <textarea
                aria-label={d.contact.preview}
                readOnly
                value={`${draft.subject}\n\n${draft.body}`}
                rows={10}
              />
              <div className="studio-actions">
                <button
                  type="button"
                  className="studio-button secondary"
                  onClick={() => {
                    setDraft(null)
                    setCopyStatus('')
                  }}
                >
                  <MotionText text={d.contact.back} />
                </button>
                <button
                  type="button"
                  className="studio-button primary"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(
                        `${draft.subject}\n\n${draft.body}`,
                      )
                      setCopyStatus(d.contact.copied)
                    } catch {
                      setCopyStatus(d.contact.copyError)
                    }
                  }}
                >
                  <Copy size={15} />
                  <MotionText text={d.contact.copy} />
                </button>
              </div>
              <p role="status">
                <MotionText text={copyStatus} />
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionSize>
    </div>
  )
}
