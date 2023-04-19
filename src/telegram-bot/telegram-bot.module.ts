import { Module } from '@nestjs/common';
import { TelegramBotUpdate } from './telegram-bot.update';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { TodoModule } from 'src/todo/todo.module';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TodoModule,
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: '6054655762:AAFeNzyUq8JNJnin5kkAkxRN_RtQ_gnp8rU',
    }),
  ],
  providers: [TelegramBotUpdate],
})
export class TelegramBotModule {}
