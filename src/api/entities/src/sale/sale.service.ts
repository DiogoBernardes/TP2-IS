import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaleService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<any[]> {
        return this.prisma.sale.findMany();
    }

    async findOne(id: string): Promise<any> {
        return this.prisma.sale.findUnique({
            where: { id: parseInt(id, 10) },
        });
    }

    async create(data: { car_id: number, customer_id: number, credit_card_type_id: number }): Promise<any> {
        return this.prisma.sale.create({
            data,
        });
    }

    async update(id: string, data: { car_id?: number, customer_id?: number, credit_card_type_id?: number }): Promise<any> {
        return this.prisma.sale.update({
            where: { id: parseInt(id, 10) },
            data,
        });
    }

    async delete(id: string): Promise<any> {
        return this.prisma.sale.delete({
            where: { id: parseInt(id, 10) },
        });
    }
}
