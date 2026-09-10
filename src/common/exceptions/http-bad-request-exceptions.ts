import { HttpException, HttpStatus } from '@nestjs/common';
import { MessageLang } from '../messages/error-messages';

export class HttpBadRequestException extends HttpException {
  constructor(
    message: MessageLang,
    prop?: any,
    status = HttpStatus.BAD_REQUEST,
  ) {
    super({ message, prop }, status);
  }
}
