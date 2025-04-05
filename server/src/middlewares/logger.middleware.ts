import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import morgan from 'morgan';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    if (req.originalUrl.startsWith('/api/v1/uploaded/thumbnail/')) {
      return next();
    }

    morgan.token('short-body', (req: any) => {
      if (req.body && Object.keys(req.body).length > 0) {
        const body = JSON.stringify(req.body);
        return body.length > 100 ? body.slice(0, 100) + '...' : body;
      }
      return '';
    });

    const format =
      ':method :url :status :res[content-length] - :response-time ms :short-body';

    morgan(format, {
      stream: {
        write: (message: string) => {
          const status = res.statusCode;
          if (status >= 500) {
            this.logger.error(message.trim());
          } else if (status >= 400) {
            this.logger.warn(message.trim());
          } else {
            this.logger.log(message.trim());
          }
        },
      },
    })(req, res, next as any);
  }
}
