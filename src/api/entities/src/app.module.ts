import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BrandsModule } from './brands/brands.module';
import { ModelModule } from './models/models.module';
import { CountryModule } from './country/country.module';
import { CustomerModule } from './customer/customer.module';
@Module({
  imports: [BrandsModule, ModelModule, CountryModule, CustomerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
