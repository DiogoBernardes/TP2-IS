// brands.module.ts
import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
    providers: [BrandsService],
    controllers: [BrandsController],
})
export class BrandsModule {}
