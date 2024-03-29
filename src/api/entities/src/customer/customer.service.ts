import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CustomerService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findAll(page: number = 1, pageSize: number = 20): Promise<any[]> {
    const skip = (page - 1) * pageSize;

    return this.prisma.customer.findMany({
      skip: skip,
      take: 20,
    });
  }

  async findOne(id: string): Promise<any> {
    return this.prisma.customer.findUnique({
      where: { id: parseInt(id, 10) },
    });
  }

  async getTotalCount(): Promise<number> {
    return this.prisma.customer.count();
  }

  async getCustomerIDByName(
    firstName: string,
    lastName: string,
  ): Promise<number | null> {
    try {
      const customer = await this.prisma.customer.findFirst({
        where: {
          first_name: firstName,
          last_name: lastName,
        },
        select: { id: true },
      });

      return customer?.id || null;
    } catch (error) {
      console.error(`Error in getCustomerIDByName: ${error.message}`);
      throw error;
    }
  }

  async create(data: {
    first_name: string;
    last_name: string;
    country_id: number;
  }): Promise<any> {
    return this.prisma.customer.create({
      data,
    });
  }

  async update(
    id: string,
    data: { first_name?: string; last_name?: string },
  ): Promise<any> {
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

  async deleteAll(): Promise<any> {
    return this.prisma.customer.deleteMany();
  }
}
