import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CreditCardTypeService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<any[]> {
    return this.prisma.creditCard_Type.findMany();
  }

  async findOne(id: string): Promise<any> {
    return this.prisma.creditCard_Type.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async getCardIdByName(name: string): Promise<number | null> {
    try {
      const card = await this.prisma.creditCard_Type.findFirst({
        where: { name },
        select: { id: true },
      });

      return card?.id || null;
    } catch (error) {
      console.error(`Error in getBrandIdByName: ${error.message}`);
      throw error;
    }
  }

  async create(data: { name: string }): Promise<any> {
    return this.prisma.creditCard_Type.create({
      data,
    });
  }

  async update(id: string, data: { name?: string }): Promise<any> {
    return this.prisma.creditCard_Type.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.creditCard_Type.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  async deleteAll(): Promise<any> {
    return this.prisma.creditCard_Type.deleteMany();
  }
}
