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
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const [data, totalCount] = await Promise.all([
      this.saleService.findAll(page, pageSize),
      this.saleService.getTotalCount(),
    ]);

    return {
      data,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.saleService.findOne(id);
  }

  @Post('create')
  async create(
    @Body()
    data: {
      car_id: number;
      customer_id: number;
      credit_card_type_id: number;
    },
  ) {
    return this.saleService.create(data);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body()
    data: {
      car_id?: number;
      customer_id?: number;
      credit_card_type_id?: number;
    },
  ) {
    return this.saleService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.saleService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.saleService.deleteAll();
  }
}
