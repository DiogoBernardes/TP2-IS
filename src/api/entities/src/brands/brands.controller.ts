import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const brands = await this.brandsService.findAll(page, pageSize);
    const totalCount = await this.brandsService.getTotalCount();

    return {
      data: brands,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Get('by-name/:name')
  async getModelIDByName(@Param('name') name: string) {
    return this.brandsService.getBrandIdByName(name);
  }

  @Post('create')
  async create(@Body() data: { name: string }) {
    return this.brandsService.create(data);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.brandsService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.brandsService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.brandsService.deleteAll();
  }
}
