import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class SaleService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(page: number = 1, pageSize: number = 20): Promise<any[]> {
    const skip = (page - 1) * pageSize;
    return this.prisma.sale.findMany({
      skip: skip,
      take: 20,
    });
  }

  async findOne(id: string): Promise<any> {
    return this.prisma.sale.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.sale.count();
  }

  async create(data: {
    car_id: number;
    customer_id: number;
    credit_card_type_id: number;
  }): Promise<any> {
    return this.prisma.sale.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      car_id?: number;
      customer_id?: number;
      credit_card_type_id?: number;
    },
  ): Promise<any> {
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

  async deleteAll() {
    return this.prisma.sale.deleteMany(); // Use o método Prisma adequado para excluir todos os registros
  }
}
