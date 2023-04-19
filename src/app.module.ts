import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { TodoModule } from './todo/todo.module';
import { TelegramBotModule } from './telegram-bot/telegram-bot.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    TodoModule,
    TelegramBotModule,
  ],
  providers: [],
})
export class AppModule {}
