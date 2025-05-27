/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs-extra';
import * as path from 'path';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const acceptHeader = req.headers['accept'] || '';
    if (acceptHeader.includes('text/html')) {
      return next();
    }
    const start = Date.now();
    const { method, originalUrl, body, query, params } = req;
    const ip =
      req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const date = new Date();
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const logDir = path.join(process.cwd(), 'public/logs-server');
    const logFile = path.join(logDir, `${dateString}.log`);

    await fs.ensureDir(logDir);

    const oldSend = res.send.bind(res);
    let responseBody: any;

    res.send = (data: any) => {
      responseBody = data;
      return oldSend(data);
    };

    res.on('finish', () => {
      void (async () => {
        const duration = Date.now() - start;

        let parsedResponse;
        try {
          parsedResponse = JSON.parse(responseBody);
        } catch (err) {
          parsedResponse = responseBody;
        }

        const log = {
          timestamp: new Date().toISOString(),
          ip,
          method,
          url: originalUrl,
          params,
          query,
          body,
          response: parsedResponse,
          statusCode: res.statusCode,
          duration: `${duration}ms`,
        };

        const logEntry = `[${log.timestamp}] ${method} ${originalUrl} - ${
          res.statusCode
        } (${duration}ms)\n${JSON.stringify(log, null, 2)}\n\n`;

        try {
          await fs.appendFile(logFile, logEntry, 'utf8');
        } catch (err) {
          console.error('Error writing log:', err);
        }
      })();
    });

    next();
  }
}
