import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ModelService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAllModels(): Promise<any[]> {
    return this.prisma.model.findMany();
  }

  async findOneModel(id: string): Promise<any> {
    return this.prisma.model.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async createModel(data: { name: string; brand_id: number }): Promise<any> {
    return this.prisma.model.create({
      data,
    });
  }

  async updateModel(id: string, data: { name?: string }): Promise<any> {
    return this.prisma.model.update({
      where: { id: parseInt(id, 10) },
      data,
    });
  }

  async deleteModel(id: string): Promise<any> {
    return this.prisma.model.delete({
      where: { id: parseInt(id, 10) },
    });
  }
  async deleteAll(): Promise<any> {
    return this.prisma.model.deleteMany({});
  }
}
