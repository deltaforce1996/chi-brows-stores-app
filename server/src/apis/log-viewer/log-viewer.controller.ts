// src/log-viewer/log-viewer.controller.ts
import { Controller, Get, Query, Render } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';

@Controller('logs')
export class LogViewerController {
  @Get()
  @Render('log_server_report')
  rootPage() {
    return {};
  }

  @Get('api')
  async getLog(@Query('date') date: string) {
    const logDate = date || new Date().toISOString().split('T')[0];
    const logPath = path.resolve(
      process.cwd(),
      `public/logs-server/${logDate}.log`,
    );
    console.log(logPath);
    if (await fs.pathExists(logPath)) {
      const log = await fs.readFile(logPath, 'utf-8');
      return { log };
    } else {
      return { log: 'No logs for this date.' };
    }
  }
}
