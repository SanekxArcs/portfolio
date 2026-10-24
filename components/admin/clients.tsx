'use client'

import {useState} from 'react'
import {useMutation, useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import type {Doc} from '@/convex/_generated/dataModel'
import {Button, Field, Repeater, TextInput, Toggle, useSave} from './fields'

type Client = Omit<Doc<'clients'>, '_id' | '_creationTime' | 'order'>

export function ClientsView() {
  const clients = useQuery(api.admin.clients)
  if (!clients) return <p className="text-muted">Loading…</p>
  return (
    <ClientsEditor
      key={clients.map((client) => client._id).join()}
      initial={clients.map(({name, url, featured, linked}) => ({name, url, featured, linked}))}
    />
  )
}

function ClientsEditor({initial}: {initial: Client[]}) {
  const [clients, setClients] = useState(initial)
  const save = useMutation(api.admin.saveClients)
  const {saving, run} = useSave()
  const valid = clients.every((client) => client.name.trim() && client.url.trim())
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-muted">Brands on the home page. Featured ones show first; the rest sit behind “show more”.</p>
        </div>
        <Button
          disabled={saving || !valid}
          onClick={() =>
            run(() => save({clients: clients.map((client) => ({...client, name: client.name.trim(), url: client.url.trim()}))}))
          }
        >
          {saving ? 'Saving…' : 'Save & publish'}
        </Button>
      </div>
      <Repeater
        items={clients}
        onChange={setClients}
        create={() => ({name: '', url: '', featured: false, linked: true})}
        addLabel="Add client"
        render={(client, update) => (
          <div className="grid items-end gap-4 sm:grid-cols-[1fr_1.4fr_auto]">
            <Field label="Name">
              <TextInput value={client.name} onChange={(name) => update({...client, name})} />
            </Field>
            <Field label="Website">
              <TextInput value={client.url} onChange={(url) => update({...client, url})} placeholder="https://" />
            </Field>
            <div className="flex gap-5 pb-2">
              <Toggle label="Featured" checked={client.featured} onChange={(featured) => update({...client, featured})} />
              <Toggle label="Linked" checked={client.linked} onChange={(linked) => update({...client, linked})} />
            </div>
          </div>
        )}
      />
    </div>
  )
}
