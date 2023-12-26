import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ModelService } from './models.service'; 

@Controller('models') 
export class ModelsController {
    constructor(private readonly modelService: ModelService) {}

    @Get()
    async findAll() {
        return this.modelService.findAllModels();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.modelService.findOneModel(id);
    }

    @Post('create')
    async create(@Body() data: { name: string, brand_id: number }) {
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
}
