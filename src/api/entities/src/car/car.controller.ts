import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { CarService } from './car.service';

@Controller('cars')
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Get()
    async findAll() {
        return this.carService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.carService.findOne(id);
    }

    @Post('create')
    async create(@Body() data: { color: string, year: number, model_id: number }) {
        return this.carService.create(data);
    }

    @Put('update/:id')
    async update(@Param('id') id: string, @Body() data: { color?: string, year?: number }) {
        return this.carService.update(id, data);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: string) {
        return this.carService.delete(id);
    }
}