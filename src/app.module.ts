import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: '6054655762:AAFeNzyUq8JNJnin5kkAkxRN_RtQ_gnp8rU',
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
