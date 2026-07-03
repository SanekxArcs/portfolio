import {sanityFetch} from '@/sanity/lib/live'
import {NAVBAR_DATA} from '@/sanity/queries/queries'

import {NavbarClient} from './navbar-client'

export async function Navbar() {
  const {data} = await sanityFetch({query: NAVBAR_DATA})

  return <NavbarClient logoUrl={data?.logoUrl} name={data?.name} />
}

export default Navbar
