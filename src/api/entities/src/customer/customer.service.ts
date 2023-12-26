import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomerService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<any[]> {
        return this.prisma.customer.findMany();
    }

    async findOne(id: string): Promise<any> {
        return this.prisma.customer.findUnique({
            where: { id: parseInt(id, 10) },
        });
    }

    async create(data: { first_name: string, last_name: string, country_id: number }): Promise<any> {
        return this.prisma.customer.create({
            data,
        });
    }

    async update(id: string, data: { first_name?: string, last_name?: string }): Promise<any> {
        return this.prisma.customer.update({
            where: { id: parseInt(id, 10) },
            data,
        });
    }

    async delete(id: string): Promise<any> {
        return this.prisma.customer.delete({
            where: { id: parseInt(id, 10) },
        });
    }
}
