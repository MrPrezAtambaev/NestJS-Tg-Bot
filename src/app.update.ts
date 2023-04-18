import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Action,
  Command,
  Ctx,
  Hears,
  InjectBot,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { actionsButtons } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

const todos = [
  {
    id: 1,
    title: 'Emir',
    completed: false,
  },
  {
    id: 2,
    title: 'akyl',
    completed: true,
  },
];

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi Emir kandaisyn!');
    await ctx.reply('Эмне кылайын деватасын?', actionsButtons());
  }

  @Command('list')
  @Hears('Список дел')
  async getList(ctx: Context) {
    await ctx.replyWithHTML(
      `Сенин личный кабинетин(думай что ты дипутать)\n\n${showList(todos)}`,
    );
  }
  @Command('done')
  @Hears('Аткаруу👨‍👨‍👦')
  async doneTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.reply('Жас(обьязательно) ID дела');
    ctx.session.type = 'done';
  }
  @Command('edit')
  @Hears('Редактривание дела💀')
  async editTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Жас(обьязательно) ID, жаны лощадь дела: \n\n' +
        'В формате - <b>1 | Новое название</b>',
    );
    ctx.session.type = 'edit';
  }

  @Command('delete')
  @Hears('Удаление 😘')
  async removeTask(ctx: Context) {
    await ctx.reply('Жас(обьязательно) ID дела');
    ctx.session.type = 'delete';
  }
  @On('text')
  async getMessage(@Message('text') someText: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;

    if (ctx.session.type === 'done') {
      const todo = todos.find((t) => t.id === Number(someText));
      if (!todo) {
        ctx.deleteMessage();
        ctx.reply('Мындай иш жок (далбуоп)');
        return;
      }

      todo.completed = !todo.completed;
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'edit') {
      const [taskId, newTitle] = someText.split(' | ');

      const todo = todos.find((t) => t.id === Number(taskId));

      if (!todo) {
        ctx.deleteMessage();
        ctx.reply('Мындай иш жок (далбуоп)');
        return;
      }

      todo.title = newTitle;
      await ctx.reply(showList(todos));
    }

    if (ctx.session.type === 'delete') {
      const todo = todos.find((t) => t.id === Number(someText));

      if (!todo) {
        ctx.deleteMessage();
        ctx.reply('Мындай иш жок (далбуоп)');
        return;
      }
      await ctx.reply(showList(todos.filter((t) => t.id === Number(someText))));
    }
  }
}
