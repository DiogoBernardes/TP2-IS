// models.module.ts
import { Module } from '@nestjs/common';
import { ModelService } from './models.service'; 
import { ModelsController } from './models.controller';  

@Module({
    providers: [ModelService],  
    controllers: [ModelsController],  
})
export class ModelModule {}
