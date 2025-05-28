// upload.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadEntity } from 'src/db/entities/upload.entity';
import { createHash } from 'crypto';
import * as fs from 'fs/promises';
import { existsSync, unlinkSync } from 'fs';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(UploadEntity)
    private readonly uploadRepo: Repository<UploadEntity>,
  ) {}

  // async uploadFile(
  //   file: Express.Multer.File,
  //   ownerId: string,
  //   ownerType: 'employee' | 'customer' | 'order' | 'product',
  // ) {
  //   const filePath = `public/uploads/${file.filename}`;

  //   let buffer: Buffer;
  //   try {
  //     buffer = await fs.readFile(filePath);
  //   } catch {
  //     throw new Error('Uploaded file is missing from disk');
  //   }

  //   const hash = createHash('sha256').update(buffer).digest('hex');

  //   const exists = await this.uploadRepo.findOneBy({ hash });
  //   if (exists) {
  //     if (existsSync(filePath)) unlinkSync(filePath);
  //     return exists;
  //   }

  //   const newUpload = this.uploadRepo.create({
  //     filename: file.originalname,
  //     mimetype: file.mimetype,
  //     size: file.size,
  //     hash,
  //     path: `uploads/${file.filename}`,
  //     owner_id: ownerId,
  //     owner_type: ownerType,
  //   });

  //   return await this.uploadRepo.save(newUpload);
  // }

  // async uploadFile(
  //   file: Express.Multer.File,
  //   ownerId: string,
  //   ownerType: 'employee' | 'customer' | 'order' | 'product',
  // ) {
  //   const filePath = `public/uploads/${file.filename}`;

  //   let buffer: Buffer;
  //   try {
  //     buffer = await fs.readFile(filePath);
  //   } catch {
  //     throw new Error('Uploaded file is missing from disk');
  //   }

  //   const hash = createHash('sha256').update(buffer).digest('hex');

  //   const newUpload = this.uploadRepo.create({
  //     filename: file.originalname,
  //     mimetype: file.mimetype,
  //     size: file.size,
  //     hash,
  //     path: `uploads/${file.filename}`,
  //     owner_id: ownerId,
  //     owner_type: ownerType,
  //   });

  //   return await this.uploadRepo.save(newUpload);
  // }

  async uploadFile(
    file: Express.Multer.File,
    ownerId: string,
    ownerType: 'employee' | 'customer' | 'order' | 'product',
  ) {
    const filePath = `public/uploads/${file.filename}`;

    let buffer: Buffer;
    try {
      buffer = await fs.readFile(filePath);
    } catch {
      throw new Error('Uploaded file is missing from disk');
    }

    const hash = createHash('sha256').update(buffer).digest('hex');

    const exists = await this.uploadRepo.findOneBy({
      hash,
      owner_id: ownerId,
      owner_type: ownerType,
    });
    if (exists) {
      const oldFilePath = `public/${exists.path}`;
      if (existsSync(oldFilePath)) {
        unlinkSync(oldFilePath);
      }

      exists.path = `uploads/${file.filename}`;
      exists.filename = file.originalname;
      exists.mimetype = file.mimetype;
      exists.size = file.size;
      exists.owner_id = ownerId;
      exists.owner_type = ownerType;
      await this.uploadRepo.save(exists);
      return exists;
    }

    const newUpload = this.uploadRepo.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      hash,
      path: `uploads/${file.filename}`,
      owner_id: ownerId,
      owner_type: ownerType,
    });

    return await this.uploadRepo.save(newUpload);
  }

  async findByOwner(ownerId: string, baseUrl: string) {
    const uploads = await this.uploadRepo.find({
      where: { owner_id: ownerId },
    });
    return uploads.map((file) => ({
      ...file,
      url: `${baseUrl}/${file.path}`,
    }));
  }
}
