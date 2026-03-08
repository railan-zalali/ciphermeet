import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'conversations',
      columns: [
        { name: 'remote_id', type: 'string' },
        { name: 'participants_json', type: 'string' }, // JSON string of user IDs
        { name: 'last_message_at', type: 'number' },
        { name: 'last_message_preview', type: 'string' },
        { name: 'unread_count', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'messages',
      columns: [
        { name: 'remote_id', type: 'string' },
        { name: 'conversation_id', type: 'string', isIndexed: true },
        { name: 'sender_id', type: 'string' },
        { name: 'content', type: 'string' }, // Decrypted content or encrypted blob
        { name: 'message_type', type: 'string' }, // text, image, voice
        { name: 'status', type: 'string' }, // sending, sent, delivered, read, failed
        { name: 'created_at', type: 'number', isIndexed: true },
      ],
    }),
  ],
});
