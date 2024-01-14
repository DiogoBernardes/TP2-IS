import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CarService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(): Promise<any[]> {
    return this.prisma.car.findMany();
  }

  async findOne(id: string): Promise<any> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new Error('ID inválido fornecido');
    }
    return this.prisma.car.findUnique({
      where: { id: numericId },
    });
  }

  async create(data: {
    color: string;
    year: number;
    model_id: number;
  }): Promise<any> {
    return this.prisma.car.create({
      data,
    });
  }

  async findCarIdByDetails(
    color: string,
    year: string,
    modelId: string,
  ): Promise<number | null> {
    try {
      const car = await this.prisma.car.findFirst({
        where: {
          color: color,
          year: parseInt(year),
          model_id: parseInt(modelId),
        },
        select: { id: true },
      });

      return car?.id || null;
    } catch (error) {
      console.error(`Error in findCarIdByDetails: ${error.message}`);
      throw error;
    }
  }

  async update(
    id: string,
    data: { color?: string; year?: number },
  ): Promise<any> {
    return this.prisma.car.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async delete(id: string): Promise<any> {
    return this.prisma.car.delete({
      where: { id: parseInt(id, 10) },
    });
  }

  async deleteAll(): Promise<any> {
    return this.prisma.car.deleteMany({});
  }
}
