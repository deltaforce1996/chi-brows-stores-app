import { BaseException } from './base.error';

export class ResultNotFoundExcept extends BaseException {
  constructor(message: string) {
    super(message, 404);
  }
}

export class BadRequestExcept extends BaseException {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthorizedExcept extends BaseException {
  constructor(message: string) {
    super(message, 401);
  }
}

export class ForbiddenExcept extends BaseException {
  constructor(message: string) {
    super(message, 403);
  }
}

export class InternalServerErrorExcept extends BaseException {
  constructor(message: string) {
    super(message, 500);
  }
}
