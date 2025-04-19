import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/product.dto'; // <-- แก้ไข path ของ DTO ให้ถูกต้อง
import { ProductBase } from 'src/types/product.interface';
import { Successfully } from 'src/res/successfully';

@Controller('product') // กำหนด prefix path เป็น /product
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('register') // POST /product
  async registerProduct(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.register(createProductDto);
    return new Successfully<ProductBase>('Register successfully.', result);
  }

  @Get('search') // GET /product/search?q=...
  async searchProducts(@Query('q') query: string) {
    const results = await this.productService.searchProduct(query);
    return new Successfully<ProductBase[]>('Search successfully.', results);
  }

  @Get('find/:id') // GET /product/find/P0001
  async getProductById(@Param('id') id: string): Promise<ProductBase> {
    return this.productService.getById(id);
  }
}
