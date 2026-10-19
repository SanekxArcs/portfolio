import {getProfile} from '@/lib/content'

import {NavbarClient} from './navbar-client'

export async function Navbar() {
  const data = await getProfile()

  return <NavbarClient logoUrl={data?.logoUrl} />
}

export default Navbar
