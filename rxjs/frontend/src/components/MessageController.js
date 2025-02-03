import { interval } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { format } from 'date-fns';

export default class MessageController {
  constructor() {
    this.container = document.querySelector('.container');
    this.messageList = document.querySelector('#messages-body');
    this.init();
  }

  init() {
    this.subscribeToMessages();
  }

  formatMessage(subject) {
    return subject.length > 15 ? `${subject.slice(0, 15)}...` : subject;
  }

  formatDate(timestamp) {
    return format(new Date(timestamp), 'HH:mm dd.MM.yyyy');
  }

  createMessageElement(message) {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${message.from}</td>
            <td>${this.formatMessage(message.subject)}</td>
            <td>${this.formatDate(message.received)}</td>
        `;
    return row;
  }

  addMessage(message) {
    console.log('\x1b[32m%s\x1b[0m', '[Client] Получено сообщение:', message);
    const messageElement = this.createMessageElement(message);
    this.messageList.insertBefore(messageElement, this.messageList.firstChild);
  }

  subscribeToMessages() {
    console.log('\x1b[33m%s\x1b[0m', '[Client] Подписка на сообщения активирована');
    interval(5000)
      .pipe(
        mergeMap(() => {
          console.log('\x1b[34m%s\x1b[0m', '[Client] Запрос новых сообщений...');
          return ajax.getJSON('http://localhost:3000/messages/unread').pipe(
            catchError(error => {
              console.error('\x1b[31m%s\x1b[0m', '[Client] Ошибка получения:', error);
              return { messages: [] };
            }),
          );
        }),
      )
      .subscribe({
        next: response => {
          if (response.messages && response.messages.length > 0) {
            console.log(
              '\x1b[35m%s\x1b[0m',
              '[Client] Получены новые сообщения:',
              response.messages,
            );
            response.messages.forEach(message => this.addMessage(message));
          }
        },
        error: error => console.error('\x1b[31m%s\x1b[0m', '[Client] Ошибка подписки:', error),
      });
  }
}
