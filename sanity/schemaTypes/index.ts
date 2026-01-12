import { type SchemaTypeDefinition } from 'sanity'

import { cvProfile } from './cvProfile'
import { aiConfig } from './aiConfig'
import { chatHistory } from './chatHistory'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [cvProfile, aiConfig, chatHistory],
}
