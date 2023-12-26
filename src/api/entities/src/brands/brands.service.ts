import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BrandsService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async findAll(): Promise<any[]> {
        return this.prisma.brand.findMany();
    }

    async findOne(id: string): Promise<any> {
        return this.prisma.brand.findUnique({
            where: { id: parseInt(id, 10) },
        });
    }

    async create(data: { name: string }): Promise<any> {
        return this.prisma.brand.create({
            data,
        });
    }

    async update(id: string, data: { name?: string }): Promise<any> {
        return this.prisma.brand.update({
            where: { id: parseInt(id, 10) },
            data,
        });
    }

    async delete(id: string): Promise<any> {
        return this.prisma.brand.delete({
            where: { id: parseInt(id, 10) },
        });
    }
}
