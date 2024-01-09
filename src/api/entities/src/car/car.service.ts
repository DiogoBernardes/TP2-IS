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
    return this.prisma.car.findUnique({
      where: { id: parseInt(id, 10) },
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
