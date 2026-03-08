import { Model } from '@nozbe/watermelondb';
import { field, date, json, text, readonly } from '@nozbe/watermelondb/decorators';

export class Conversation extends Model {
  static table = 'conversations';
  static associations = {
    messages: { type: 'has_many', foreignKey: 'conversation_id' },
  } as const;

  @text('remote_id') remoteId!: string;
  @text('participants_json') participantsJson!: string;
  @date('last_message_at') lastMessageAt!: Date;
  @text('last_message_preview') lastMessagePreview!: string;
  @field('unread_count') unreadCount!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  get participants() {
    return JSON.parse(this.participantsJson);
  }
}
