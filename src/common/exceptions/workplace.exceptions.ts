import { HttpStatus } from '@nestjs/common';
import { HttpBadRequestExceptionGlobal } from './core.exception';
import { MessageLang } from '../messages/error-messages';

export class WorkplaceException extends HttpBadRequestExceptionGlobal {
  constructor(
    message: MessageLang,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    prop = '',
  ) {
    super('Workplaces', message, prop, status);
  }
}
