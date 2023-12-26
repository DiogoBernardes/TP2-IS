// brands.controller.ts
import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
    constructor(private readonly brandsService: BrandsService) {}

    @Get()
    async findAll() {
        return this.brandsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.brandsService.findOne(id);
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
}
