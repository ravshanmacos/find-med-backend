import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { MessageLang } from '../messages/error-messages';

export class HttpBadRequestExceptionGlobal extends HttpException {
  constructor(
    className: string,
    message: MessageLang | string,
    prop = '',
    status = HttpStatus.BAD_REQUEST,
  ) {
    Logger.error(`${className}: ${message}, ${prop}`);
    super(
      {
        className,
        message,
        prop,
      },
      status,
    );
  }
}
