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
import { Markup, Telegraf } from 'telegraf';
import { TelegramBotContext } from './context.interface';
import {
  InlineKeyboardButton,
  InlineKeyboardMarkup,
} from 'telegraf/typings/core/types/typegram';
import { TodoService } from 'src/todo/todo.service';

@Update()
export class TelegramBotUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<TelegramBotContext>,
    private readonly todoSevice: TodoService,
  ) {
    bot.telegram.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'create', description: 'Create todo' },
      { command: 'list', description: 'Show todo list' },
    ]);
  }

  // actionsButtons(): Markup.Markup<InlineKeyboardMarkup> {
  //   return Markup.inlineKeyboard(
  //     [
  //       Markup.button.callback('Список дел', 'list', true),
  //       Markup.button.callback('Аткаруу👨‍👨‍👦', 'done', true),
  //       Markup.button.callback('Редактривание дела💀', 'edit', true),
  //       Markup.button.callback('Удаление 😘', 'delete', true),
  //     ],
  //     // {
  //     //   columns: 4,
  //     //   wrap: (btn, i, row) => i % 2 == 0,
  //     // },
  //   );
  // }

  // showList = (todos) =>
  //   todos
  //     .map((todo) => `${todo.completed ? '✅' : '🏌🏼‍♀️'} ${todo.title}`)
  //     .join('\n\n');

  @Start()
  async startCommand(ctx: TelegramBotContext) {
    try {
      await ctx.reply('Эмне кылайын деватасын?');
      await this.showTodoList(ctx);
    } catch (error) {
      ctx.reply(`Error ${error}`);
    }
  }

  async getTodoButtons(): Promise<InlineKeyboardButton.CallbackButton[]> {
    const todos = await this.todoSevice.findAll();
    const btns = todos
      .map((todo) => [
        Markup.button.callback(
          `${todo.completed ? '✅' : '⭕️'} ${todo.title}`,
          `/todo/${todo.id}/done`,
        ),
        Markup.button.callback(`Удалить этуу 💀`, `/todo/${todo.id}/delete`),
      ])
      .flat();
    btns.push(Markup.button.callback(`Обновить`, `refresh`));

    return btns;
  }

  @Action('refresh')
  async refresh(ctx: TelegramBotContext) {
    try {
      const oldMarkup: Markup.Markup<InlineKeyboardMarkup> = ctx.callbackQuery
        .message as any;

      const newMarkup = Markup.inlineKeyboard(await this.getTodoButtons(), {
        columns: 1,
      });

      const isEqual =
        JSON.stringify(
          oldMarkup.reply_markup.inline_keyboard
            .flat()
            .map((item) => item.text),
        ) ===
        JSON.stringify(
          newMarkup.reply_markup.inline_keyboard
            .flat()
            .map((item) => item.text),
        );

      if (isEqual) return;

      await ctx.editMessageText(
        `Todo List:`,
        Markup.inlineKeyboard(await this.getTodoButtons(), {
          columns: 2,
        }),
      );
    } catch (error) {
      ctx.reply(`Эскертуу ${error}`);
    }
  }

  @Command('list')
  @Action('list')
  async showTodoList(ctx: TelegramBotContext) {
    try {
      await ctx.reply(
        'Твой личный кабинет(не личный):',
        Markup.inlineKeyboard(await this.getTodoButtons(), {
          columns: 2,
        }),
      );
    } catch (error) {
      ctx.reply(`Эскертуу ${error}`);
    }
  }

  @Action(/\/todo\/[a-zA-Z0-9]+\/done/)
  async completeTodo(ctx: TelegramBotContext) {
    try {
      const callbackData = (ctx.callbackQuery as any)?.data as string; // Get the callback data
      const todoId = callbackData.match(/\/todo\/([a-zA-Z0-9]+)\/done/)[1]; // Extract the todo ID using regex

      await this.todoSevice.toggle(todoId);

      this.refresh(ctx);
    } catch (error) {
      ctx.reply(`Эскертуу ${error}`);
    }
  }

  @Action(/\/todo\/[a-zA-Z0-9]+\/delete/)
  async deleteTodo(ctx: TelegramBotContext) {
    try {
      const callbackData = (ctx.callbackQuery as any)?.data as string; // Get the callback data
      const todoId = callbackData.match(/\/todo\/([a-zA-Z0-9]+)\/delete/)[1]; // Extract the todo ID using regex

      await this.todoSevice.remove(todoId);

      this.refresh(ctx);
    } catch (error) {
      ctx.reply(`Эскертуу ${error}`);
    }
  }

  @Command('create')
  async createTodo(ctx: TelegramBotContext) {
    try {
      const title = ((ctx.message as any).text as string)
        .replace('/create', '')
        .trim();

      await this.todoSevice.create({ title });
      await this.showTodoList(ctx);
    } catch (error) {
      ctx.reply(`Эскертуу ${error}`);
    }
  }

  // @Action('list')
  // @Command('list')
  // @Hears('Список дел')
  // async getList(ctx: TelegramBotContext) {
  //   await ctx.replyWithHTML(
  //     `Сенин личный кабинетин(думай что ты дипутать)\n\n${this.showList(
  //       todos,
  //     )}`,
  //   );
  // }

  // @Command('done')
  // @Hears('Аткаруу👨‍👨‍👦')
  // async doneTask(ctx: TelegramBotContext) {
  //   await ctx.deleteMessage();
  //   await ctx.reply('Жас(обьязательно) ID дела');
  //   ctx.session.type = 'done';
  // }

  // @Command('edit')
  // @Hears('Редактривание дела💀')
  // async editTask(ctx: TelegramBotContext) {
  //   await ctx.deleteMessage();
  //   await ctx.replyWithHTML(
  //     'Жас(обьязательно) ID, жаны лощадь дела: \n\n' +
  //       'В формате - <b>1 | Новое название</b>',
  //   );
  //   ctx.session.type = 'edit';
  // }

  // @Command('delete')
  // @Hears('Удаление 😘')
  // async removeTask(ctx: TelegramBotContext) {
  //   await ctx.reply('Жас(обьязательно) ID дела');
  //   ctx.session.type = 'delete';
  // }

  // @On('text')
  // async getMessage(
  //   @Message('text') someText: string,
  //   @Ctx() ctx: TelegramBotContext,
  // ) {
  //   if (!ctx.session.type) return;

  //   if (ctx.session.type === 'done') {
  //     const todo = todos.find((t) => t.id === someText);
  //     if (!todo) {
  //       ctx.deleteMessage();
  //       ctx.reply('Мындай иш жок (далбуоп)');
  //       return;
  //     }

  //     todo.completed = !todo.completed;
  //     await ctx.reply(this.showList(todos));
  //   }

  //   if (ctx.session.type === 'edit') {
  //     const [taskId, newTitle] = someText.split(' | ');

  //     const todo = todos.find((t) => t.id === taskId);

  //     if (!todo) {
  //       ctx.deleteMessage();
  //       ctx.reply('Мындай иш жок (далбуоп)');
  //       return;
  //     }

  //     todo.title = newTitle;
  //     await ctx.reply(this.showList(todos));
  //   }

  //   if (ctx.session.type === 'delete') {
  //     const todo = todos.find((t) => t.id === someText);

  //     if (!todo) {
  //       ctx.deleteMessage();
  //       ctx.reply('Мындай иш жок (далбуоп)');
  //       return;
  //     }
  //     await ctx.reply(this.showList(todos.filter((t) => t.id === someText)));
  //   }
  // }
}
