// upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Param,
  Get,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Request } from 'express';
import { Successfully } from 'src/res/successfully';
import {
  AuthorizedExceptFilter,
  BadRequestExceptFilter,
  ForbiddenExceptionFilter,
  InternalServerErrorExceptFilter,
  ResultNotFoundExceptFilter,
} from 'src/errors/filter.error';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseFilters(
  new ResultNotFoundExceptFilter(),
  new BadRequestExceptFilter(),
  new AuthorizedExceptFilter(),
  new ForbiddenExceptionFilter(),
  new InternalServerErrorExceptFilter(),
)
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':ownerType/:ownerId')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${uuidv4()}${ext}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('ownerId') ownerId: string,
    @Param('ownerType')
    ownerType: 'employee' | 'customer' | 'order' | 'product',
  ) {
    const result = await this.uploadService.uploadFile(
      file,
      ownerId,
      ownerType,
    );
    // return { success: true, file: result };
    return new Successfully<any>('Upload successful', result);
  }

  @Get('owner/:ownerId')
  async getByOwner(@Param('ownerId') ownerId: string, @Req() req: Request) {
    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const files = await this.uploadService.findByOwner(ownerId, baseUrl);
    // return { success: true, files };
    return new Successfully<any>('Find successful', files);
  }
}
