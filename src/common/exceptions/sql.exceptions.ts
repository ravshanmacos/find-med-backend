import { HttpBadRequestExceptionGlobal } from './core.exception';
import { MessageLang } from '../messages/error-messages';

export class SQLException extends HttpBadRequestExceptionGlobal {
  constructor(message: MessageLang, prop = '') {
    super('SQL', message, prop);
  }
}
