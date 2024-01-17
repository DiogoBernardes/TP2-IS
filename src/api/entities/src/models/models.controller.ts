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
import { ModelService } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelService: ModelService) {}

  @Get('findModels/')
  async findAllModels(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 20,
  ) {
    const models = await this.modelService.findAllModels(page, pageSize);
    const totalCount = await this.modelService.getTotalCount();

    return {
      data: models,
      totalCount,
    };
  }

  @Get()
  async findAll() {
    return this.modelService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.modelService.findOneModel(id);
  }

  @Get('by-name/:name')
  async getModelIDByName(@Param('name') name: string) {
    return this.modelService.getModelIDByName(name);
  }

  @Post('create')
  async create(@Body() data: { name: string; brand_id: number }) {
    return this.modelService.createModel(data);
  }

  @Put('update/:id')
  async update(@Param('id') id: string, @Body() data: { name?: string }) {
    return this.modelService.updateModel(id, data);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.modelService.deleteModel(id);
  }

  @Delete('delete-all')
  async deleteAll() {
    return this.modelService.deleteAll();
  }
}
