import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { CreditCardTypeService } from './creditCard_Type.service';

@Controller('credit-card-types')
export class CreditCardTypeController {
  constructor(private readonly creditCardTypeService: CreditCardTypeService) {}

  @Get()
  async findAll() {
    return this.creditCardTypeService.findAll();
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
