import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Post('create')
  async create(
    @Body() data: { first_name: string; last_name: string; country_id: number },
  ) {
    return this.customerService.create(data);
  }

  @Put('update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: { first_name?: string; last_name?: string },
  ) {
    return this.customerService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.customerService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.customerService.deleteAll();
  }
}
