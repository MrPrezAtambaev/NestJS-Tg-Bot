import { Markup } from 'telegraf';
import { ReplyKeyboardMarkup } from 'telegraf/typings/core/types/typegram';

export function actionsButtons(): Markup.Markup<ReplyKeyboardMarkup> {
  return Markup.keyboard(
    [
      Markup.button.callback('Список дел', 'list'),
      Markup.button.callback('Аткаруу👨‍👨‍👦', 'done'),
      Markup.button.callback('Редактривание дела💀', 'edit'),
      Markup.button.callback('Удаление 😘', 'delete'),
    ],
    {
      columns: 4,
      wrap: (btn, i, row) => i % 2 == 0,
    },
  );
}
