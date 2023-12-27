import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { CarController } from './car.controller';

@Module({
    providers: [CarService],
    controllers: [CarController],
})
export class CarModule {}
