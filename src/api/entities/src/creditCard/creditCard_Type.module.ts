import { Module } from '@nestjs/common';
import { CreditCardTypeService } from './creditCard_Type.service';
import { CreditCardTypeController } from './creditCard_Type.controller';

@Module({
    providers: [CreditCardTypeService],
    controllers: [CreditCardTypeController],
})
export class CreditCardTypeModule {}
