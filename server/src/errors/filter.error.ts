import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import {
  ResultNotFoundExcept,
  BadRequestExcept,
  AuthorizedExcept,
  ForbiddenExcept,
  InternalServerErrorExcept,
} from './exception.error';
import { Failure } from 'src/res/failed.error';

@Catch(ResultNotFoundExcept)
export class ResultNotFoundExceptFilter implements ExceptionFilter {
  catch(exception: ResultNotFoundExcept, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
    response.status(status).json(new Failure(`${message}`));
  }
}

@Catch(BadRequestExcept)
export class BadRequestExceptFilter implements ExceptionFilter {
  catch(exception: BadRequestExcept, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
    response.status(status).json(new Failure(`${message}`));
  }
}

@Catch(AuthorizedExcept)
export class AuthorizedExceptFilter implements ExceptionFilter {
  catch(exception: AuthorizedExcept, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
    response.status(status).json(new Failure(`${message}`));
  }
}

@Catch(ForbiddenExcept)
export class ForbiddenExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenExcept, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
    response.status(status).json(new Failure(`${message}`));
  }
}

@Catch(InternalServerErrorExcept)
export class InternalServerErrorExceptFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorExcept, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : JSON.stringify(exceptionResponse);
    response.status(status).json(new Failure(`${message}`));
  }
}
