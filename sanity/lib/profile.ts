import 'server-only'
import {cache} from 'react'
import {sanityFetch} from './client'
import {CV_PROFILE_DATA} from '../queries/queries'

// One shared cached public projection for the page, navigation, footer and metadata.
export const getProfile = cache(() => sanityFetch({query: CV_PROFILE_DATA, tags: ['cvProfile']}))
