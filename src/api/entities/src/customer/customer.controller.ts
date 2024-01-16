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
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const customer = await this.customerService.findAll(page, pageSize);
    const totalCount = await this.customerService.getTotalCount();

    return {
      data: customer,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Get('get-id/:firstName/:lastName')
  async getCustomerIdByName(
    @Param('firstName') firstName: string,
    @Param('lastName') lastName: string,
  ) {
    try {
      const customerID = await this.customerService.getCustomerIDByName(
        firstName,
        lastName,
      );
      return customerID;
    } catch (error) {
      return { error: error.message };
    }
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
