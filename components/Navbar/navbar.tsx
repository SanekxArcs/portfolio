import {client} from '@/sanity/lib/client'
import {NAVBAR_DATA} from '@/sanity/queries/queries'
import {NAVBAR_DATA_RESULT} from '@/sanity.types'

import {NavbarClient} from './navbar-client'

export async function Navbar() {
  const data = await client.fetch<NAVBAR_DATA_RESULT>(NAVBAR_DATA)

  return <NavbarClient logoUrl={data?.logoUrl} name={data?.name} />
}

export default Navbar
