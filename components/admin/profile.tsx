'use client'

import {useState} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import type {Doc} from '@/convex/_generated/dataModel'
import {
  Button,
  Field,
  LangSwitch,
  LinesInput,
  LocalLines,
  LocalText,
  Repeater,
  Section,
  TextInput,
  Toggle,
  body,
  cleanLines,
  cleanText,
  tidy,
  useSave,
  type Lang,
} from './fields'
import {FileSlots} from './file-slots'

// The CV and photo have their own versioned upload flow (FileSlots), so a profile save leaves them alone.
type Profile = Omit<ReturnType<typeof body<Doc<'profile'>>>, 'cv' | 'photo' | 'cvFileUrl' | 'profilePhotoUrl'>

export function ProfileView() {
  const profile = useQuery(api.admin.profile)
  if (profile === undefined) return <p className="text-muted">Loading…</p>
  if (!profile)
    return <p className="text-muted">No profile yet. Import the existing content with: npx convex run seed:importContent</p>
  return <ProfileEditor key={profile._id} doc={profile} />
}

function ProfileEditor({doc}: {doc: Doc<'profile'>}) {
  const [draft, setDraft] = useState<Profile>(() => {
    const {cv, photo, cvFileUrl, profilePhotoUrl, ...editable} = body(doc)
    void [cv, photo, cvFileUrl, profilePhotoUrl]
    return editable
  })
  const [lang, setLang] = useState<Lang>('en')
  const save = useMutation(api.admin.saveProfile)
  const {saving, run} = useSave()
  const set = (patch: Partial<Profile>) => setDraft((old) => ({...old, ...patch}))
  const soft = draft.softSkills[lang] ?? []

  const submit = () =>
    run(() =>
      save({
        profile: {
          ...draft,
          name: draft.name.trim(),
          role: cleanText(draft.role),
          description: cleanText(draft.description),
          about: cleanText(draft.about),
          skillsFrontend: tidy(draft.skillsFrontend),
          skillsBackend: tidy(draft.skillsBackend),
          skillsDevOps: tidy(draft.skillsDevOps),
          skillsOther: cleanLines(draft.skillsOther),
          interests: cleanLines(draft.interests),
          education: draft.education.map((item) => ({...item, specialization: cleanText(item.specialization)})),
          contacts: {
            ...draft.contacts,
            typeOfContract: tidy(draft.contacts.typeOfContract ?? []),
          },
        },
      }),
    )

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-muted">Shown on the home, experience and contact pages, and in structured data.</p>
        </div>
        <LangSwitch lang={lang} onChange={setLang} />
        <Button onClick={submit} disabled={saving || !draft.name.trim()}>
          {saving ? 'Saving…' : 'Save & publish'}
        </Button>
      </div>

      <Section title={`About · ${lang.toUpperCase()}`} aside={lang !== 'en' && <span className="text-xs text-muted">Empty fields show English</span>}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={draft.name} onChange={(name) => set({name})} />
          </Field>
          <Field label="Role">
            <LocalText value={draft.role} lang={lang} onChange={(role) => set({role})} />
          </Field>
        </div>
        <Field label="Short description">
          <LocalText multiline rows={3} value={draft.description} lang={lang} onChange={(description) => set({description})} />
        </Field>
        <Field label="About">
          <LocalText multiline rows={6} value={draft.about} lang={lang} onChange={(about) => set({about})} />
        </Field>
        <Field label="Interests" hint="One per line">
          <LocalLines value={draft.interests} lang={lang} onChange={(interests) => set({interests})} />
        </Field>
      </Section>

      <Section title="Skills">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Front end" hint="One per line">
            <LinesInput rows={8} value={draft.skillsFrontend} onChange={(skillsFrontend) => set({skillsFrontend})} />
          </Field>
          <Field label="Back end">
            <LinesInput rows={8} value={draft.skillsBackend} onChange={(skillsBackend) => set({skillsBackend})} />
          </Field>
          <Field label="DevOps & tools">
            <LinesInput rows={8} value={draft.skillsDevOps} onChange={(skillsDevOps) => set({skillsDevOps})} />
          </Field>
        </div>
        <Field label={`Other skills · ${lang.toUpperCase()}`} hint="One per line">
          <LocalLines value={draft.skillsOther} lang={lang} onChange={(skillsOther) => set({skillsOther})} />
        </Field>
      </Section>

      <Section title={`Soft skills · ${lang.toUpperCase()}`} aside={lang !== 'en' && !soft.length && <span className="text-xs text-muted">Showing English on the site</span>}>
        <Repeater
          items={soft}
          onChange={(items) => set({softSkills: {...draft.softSkills, [lang]: items}})}
          create={() => ({skill: ''})}
          addLabel="Add soft skill"
          render={(item, update) => (
            <div className="grid gap-3">
              <Field label="Skill">
                <TextInput value={item.skill} onChange={(skill) => update({...item, skill})} />
              </Field>
              <Field label="Example">
                <LocalOnlyArea value={item.description} onChange={(description) => update({...item, description})} />
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Education">
        <Repeater
          items={draft.education}
          onChange={(education) => set({education})}
          create={() => ({specialization: {en: ''}})}
          addLabel="Add education"
          render={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institution">
                <TextInput value={item.institution} onChange={(institution) => update({...item, institution})} />
              </Field>
              <Field label={`Specialization · ${lang.toUpperCase()}`}>
                <LocalText value={item.specialization} lang={lang} onChange={(specialization) => update({...item, specialization})} />
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Email">
            <TextInput value={draft.contacts.email} onChange={(email) => set({contacts: {...draft.contacts, email}})} />
          </Field>
          <Field label="Phone">
            <TextInput value={draft.contacts.phoneNumber} onChange={(phoneNumber) => set({contacts: {...draft.contacts, phoneNumber}})} />
          </Field>
          <Field label="Location">
            <TextInput value={draft.contacts.location} onChange={(location) => set({contacts: {...draft.contacts, location}})} />
          </Field>
        </div>
        <Field label="Contract types" hint="One per line">
          <LinesInput
            rows={3}
            value={draft.contacts.typeOfContract}
            onChange={(typeOfContract) => set({contacts: {...draft.contacts, typeOfContract}})}
          />
        </Field>
        <Toggle
          label="Open to relocation"
          checked={!!draft.contacts.relocationReady}
          onChange={(relocationReady) => set({contacts: {...draft.contacts, relocationReady}})}
        />
      </Section>

      <Section title="Links">
        <Repeater
          items={draft.links}
          onChange={(links) => set({links})}
          create={() => ({name: '', link: ''})}
          addLabel="Add link"
          render={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Label">
                <TextInput value={item.name} onChange={(name) => update({...item, name})} />
              </Field>
              <Field label="URL">
                <TextInput value={item.link} onChange={(link) => update({...item, link})} />
              </Field>
              <Field label="Tooltip">
                <TextInput value={item.title} onChange={(title) => update({...item, title})} />
              </Field>
              <Field label="Icon name" hint="Github, Linkedin, …">
                <TextInput value={item.iconName} onChange={(iconName) => update({...item, iconName})} />
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Languages">
        <Repeater
          items={draft.languages}
          onChange={(languages) => set({languages})}
          create={() => ({language: ''})}
          addLabel="Add language"
          render={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Language">
                <TextInput value={item.language} onChange={(language) => update({...item, language})} />
              </Field>
              <Field label="Level">
                <TextInput value={item.level} onChange={(level) => update({...item, level})} />
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Courses">
        <Repeater
          items={draft.courses}
          onChange={(courses) => set({courses})}
          create={() => ({title: '', visibleOnCV: true})}
          addLabel="Add course"
          render={(item, update) => (
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Title">
                <TextInput value={item.title} onChange={(title) => update({...item, title})} />
              </Field>
              <Field label="Platform">
                <TextInput value={item.platform} onChange={(platform) => update({...item, platform})} />
              </Field>
              <Field label="Date">
                <TextInput value={item.date} onChange={(date) => update({...item, date})} placeholder="10.2022" />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Badges" hint="One per line">
                  <LinesInput rows={3} value={item.badges} onChange={(badges) => update({...item, badges})} />
                </Field>
              </div>
              <Toggle label="Show on CV" checked={!!item.visibleOnCV} onChange={(visibleOnCV) => update({...item, visibleOnCV})} />
            </div>
          )}
        />
      </Section>

      <FileSlots />

      <Section title="Links to files">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Logo URL">
            <TextInput value={draft.logoUrl} onChange={(logoUrl) => set({logoUrl})} />
          </Field>
          <Field label="Online CV URL" hint="The “view online” link next to the download button.">
            <TextInput value={draft.cvUrl} onChange={(cvUrl) => set({cvUrl})} />
          </Field>
        </div>
      </Section>

      <div className="flex justify-end">
        <Button onClick={submit} disabled={saving || !draft.name.trim()}>
          {saving ? 'Saving…' : 'Save & publish'}
        </Button>
      </div>
    </div>
  )
}

function LocalOnlyArea({value, onChange}: {value: string | undefined; onChange: (value: string) => void}) {
  return (
    <textarea
      rows={3}
      className="w-full resize-y rounded-lg border border-line bg-ink px-3 py-2 text-sm leading-relaxed outline-none focus:border-mint/70"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
