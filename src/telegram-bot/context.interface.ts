import { Context as ContextTelegraf } from 'telegraf';

export interface TelegramBotContext extends ContextTelegraf {
  session: {
    type: 'done' | 'edit' | 'delete';
  };
}
