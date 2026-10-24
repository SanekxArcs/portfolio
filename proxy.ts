import {convexAuthNextjsMiddleware} from '@convex-dev/auth/nextjs/server'

// Handles the admin's sign-in cookies. Scoped so public pages never run it.
export default convexAuthNextjsMiddleware()

export const config = {matcher: ['/admin/:path*', '/api/auth/:path*']}
