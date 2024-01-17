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
import { CountryService } from './country.service';
import { count } from 'console';

@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const countries = await this.countryService.findAll(page, pageSize);
    const totalCount = await this.countryService.getTotalCount();

    return {
      data: countries,
      totalCount,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.countryService.findOne(id);
  }

  @Get('by-name/:name')
  async getCountryIDByName(@Param('name') name: string) {
    return this.countryService.getIDByName(name);
  }

  @Post('create')
  async create(@Body() data: { name: string }) {
    return this.countryService.create(data);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.countryService.update(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.countryService.delete(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.countryService.deleteAll();
  }
}
