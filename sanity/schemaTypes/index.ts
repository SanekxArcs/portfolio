import { type SchemaTypeDefinition } from 'sanity'

import { cvProfile } from './cvProfile'
import { aiConfig } from './aiConfig'
import { chatHistory } from './chatHistory'
import {privateArchive} from './privateArchive'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cvProfile, aiConfig, chatHistory, privateArchive],
}
