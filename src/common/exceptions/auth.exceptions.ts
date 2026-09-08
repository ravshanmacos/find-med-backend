import { HttpStatus } from '@nestjs/common';
import { HttpBadRequestExceptionGlobal } from './core.exception';
import { MessageLang } from '../messages/error-messages';

export class AuthException extends HttpBadRequestExceptionGlobal {
  constructor(
    message: MessageLang,
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
    prop = '',
  ) {
    super('Auth', message, prop, status);
  }
}
