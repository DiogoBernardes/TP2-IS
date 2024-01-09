import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SaleService } from './sale.service';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async findAll() {
    return this.saleService.findAll();
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
