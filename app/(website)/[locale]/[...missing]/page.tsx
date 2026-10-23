import {notFound} from 'next/navigation'

// Unknown paths under a language render that language's not-found page inside the site
// layout (correct lang, header and footer) instead of the framework's bare default.
export default function Missing() {
  notFound()
}
