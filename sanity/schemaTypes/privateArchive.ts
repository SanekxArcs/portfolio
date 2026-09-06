import {defineField, defineType} from 'sanity'

export const privateArchive = defineType({
  name: 'privateArchive', title: 'Protected original records', type: 'document', readOnly: true,
  fields: [
    defineField({name: 'sourceType', title: 'Original document type', type: 'string'}),
    defineField({name: 'archivedAt', title: 'Protected on', type: 'datetime'}),
    defineField({name: 'snapshot', title: 'Original record (JSON)', type: 'text'}),
  ],
  validation: Rule => Rule.custom(doc => doc?._id?.startsWith('private.') ? true : 'Archives must use a private document ID.'),
})
