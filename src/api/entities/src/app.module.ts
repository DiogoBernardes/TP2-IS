import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { ModelModule } from './models/models.module';
import { CountryModule } from './country/country.module';
@Module({
  imports: [BrandsModule, ModelModule, CountryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
