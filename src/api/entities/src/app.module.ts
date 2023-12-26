import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { ModelModule } from './models/models.module';

@Module({
  imports: [BrandsModule, ModelModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
