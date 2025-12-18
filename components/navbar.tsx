import { client } from "@/sanity/lib/client";
import { NAVBAR_DATA } from "@/sanity/queries/queries";
import { NAVBAR_DATAResult } from "@/sanity.types";
import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const data = await client.fetch<NAVBAR_DATAResult>(NAVBAR_DATA);

  return <NavbarClient logoUrl={data?.logoUrl} name={data?.name} />;
}

export default Navbar;
