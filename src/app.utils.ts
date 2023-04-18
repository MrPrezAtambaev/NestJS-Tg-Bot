export const showList = (todos) =>
  todos
    .map((todo) => `${todo.completed ? '✅' : '🏌🏼‍♀️'} ${todo.title}`)
    .join('\n\n');
