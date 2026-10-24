import {siteUrl} from '@/lib/site'
import {getCvFile} from '@/lib/studio-content'

// Prerendered like the pages; replacing the CV in the admin expires it with the rest of the content.
export const dynamic = 'force-static'

/** The current CV as a download, served from this origin so the filename is kept. */
export async function GET() {
  const file = await getCvFile()
  if (!file) return new Response(null, {status: 404})
  const response = await fetch(new URL(file.url, siteUrl))
  if (!response.ok) return new Response(null, {status: 502})
  return new Response(await response.arrayBuffer(), {
    headers: {
      'Content-Type': response.headers.get('Content-Type') ?? 'application/pdf',
      'Content-Disposition': `attachment; filename="${file.name.replace(/[^\w.-]+/g, '-')}"`,
    },
  })
}
