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
import { CarService } from './car.service';

@Controller('cars')
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const [data, totalCount] = await Promise.all([
      this.carService.findAll(page, pageSize),
      this.carService.getTotalCount(),
    ]);

    return {
      data,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.carService.findOne(id);
  }

  @Get('find-by-details/:color/:year/:model_id')
  async findCarIdByDetails(
    @Param('color') color: string,
    @Param('year') year: string,
    @Param('model_id') modelId: string,
  ) {
    return this.carService.findCarIdByDetails(color, year, modelId);
  }

  @Post('create')
  async create(
    @Body() data: { color: string; year: number; model_id: number },
  ) {
    return this.carService.create(data);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: { color?: string; year?: number },
  ) {
    return this.carService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.carService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.carService.deleteAll();
  }
}
