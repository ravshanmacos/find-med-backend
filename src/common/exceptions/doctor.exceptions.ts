import { HttpStatus } from '@nestjs/common';
import { HttpBadRequestExceptionGlobal } from './core.exception';
import { MessageLang } from '../messages/error-messages';

export class DoctorException extends HttpBadRequestExceptionGlobal {
  constructor(
    message: MessageLang,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
    prop = '',
  ) {
    super('Doctors', message, prop, status);
  }
}
