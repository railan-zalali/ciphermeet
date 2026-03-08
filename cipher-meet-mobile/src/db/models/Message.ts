import { Model } from '@nozbe/watermelondb';
import { field, date, text, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Conversation } from './Conversation';

export class Message extends Model {
  static table = 'messages';
  static associations = {
    conversations: { type: 'belongs_to', key: 'conversation_id' },
  } as const;

  @text('remote_id') remoteId!: string;
  @relation('conversations', 'conversation_id') conversation!: Conversation;
  @text('sender_id') senderId!: string;
  @text('content') content!: string;
  @text('message_type') messageType!: string;
  @text('status') status!: string;
  @readonly @date('created_at') createdAt!: Date;
}
