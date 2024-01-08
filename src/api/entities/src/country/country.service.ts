import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CountryService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<any[]> {
    return this.prisma.country.findMany();
  }

  async findOne(id: string): Promise<any> {
    return this.prisma.country.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async getIDByName(name: string): Promise<number | null> {
    try {
      const country = await this.prisma.country.findFirst({
        where: { name },
        select: { id: true },
      });

      return country?.id || null;
    } catch (error) {
      console.error(`Error in getIDByName: ${error.message}`);
      throw error;
    }
  }

  async create(data: { name: string }): Promise<any> {
    return this.prisma.country.create({
      data,
    });
  }

  async update(id: string, data: { name?: string }): Promise<any> {
    return this.prisma.country.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.country.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  async deleteAll(): Promise<any> {
    return this.prisma.country.deleteMany({});
  }
}
