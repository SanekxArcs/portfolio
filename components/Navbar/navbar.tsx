import {getProfile} from '@/sanity/lib/profile'

import {NavbarClient} from './navbar-client'

export async function Navbar() {
  const data = await getProfile()

  return <NavbarClient logoUrl={data?.logoUrl} name={data?.name} />
}

export default Navbar
