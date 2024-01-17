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
import { CreditCardTypeService } from './creditCard_Type.service';

@Controller('credit-card-types')
export class CreditCardTypeController {
  constructor(private readonly creditCardTypeService: CreditCardTypeService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const creditCards = await this.creditCardTypeService.findAll(
      page,
      pageSize,
    );
    const totalCount = await this.creditCardTypeService.getTotalCount();

    return {
      data: creditCards,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.creditCardTypeService.findOne(id);
  }

  @Get('by-name/:name')
  async getCardIdByName(@Param('name') name: string) {
    return this.creditCardTypeService.getCardIdByName(name);
  }

  @Post('create')
  async create(@Body() data: { name: string }) {
    return this.creditCardTypeService.create(data);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.creditCardTypeService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.creditCardTypeService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.creditCardTypeService.deleteAll();
  }
}
