import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ApiErrorBody {
  statusCode: number;
  path: string;
  timestamp: string;
  message: string | string[];
  error: string;
}

/**
 * Normalizes every thrown error — HttpException or otherwise — into a
 * single consistent JSON shape, and makes sure unexpected errors never leak
 * internal details (stack traces, driver errors) to the client.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;
    const message = this.extractMessage(exceptionResponse, exception, statusCode);

    const body: ApiErrorBody = {
      statusCode,
      path: request.url,
      timestamp: new Date().toISOString(),
      message,
      error: isHttpException ? exception.name : 'InternalServerError',
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      // Never log request bodies here — they may contain sensitive financial data.
      this.logger.error(`${request.method} ${request.url} -> ${statusCode}`, (exception as Error)?.stack);
    }

    response.status(statusCode).json(body);
  }

  private extractMessage(
    exceptionResponse: unknown,
    exception: unknown,
    statusCode: number,
  ): string | string[] {
    if (exceptionResponse && typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      return (exceptionResponse as { message: string | string[] }).message;
    }
    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      return 'Internal server error';
    }
    return (exception as Error)?.message ?? 'Unexpected error';
  }
}
