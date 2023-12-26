// brands.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';

describe('BrandsService', () => {
    let service: BrandsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [BrandsService],
        }).compile();

        service = module.get<BrandsService>(BrandsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should find all brands', async () => {
        const result = await service.findAll();
        expect(result).toEqual([]);
    });

});
