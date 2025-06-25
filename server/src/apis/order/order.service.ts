// src/order/order.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustEntity } from 'src/db/entities/cust.entity';
import { EmployeeEntity } from 'src/db/entities/emp.entity';
import { OrderItemEntity } from 'src/db/entities/order-item.entity';
import { OrderEntity } from 'src/db/entities/order.entity';
import { ProductEntity } from 'src/db/entities/product.entity';
import { OrderStatus } from 'src/utils/order-status.enum';
import { Repository, DataSource } from 'typeorm';
import { UploadEntity } from 'src/db/entities/upload.entity';

import {
  CreateOrderDto,
  CreateOrderWithCustomerDto,
  UpdateOrderStatusDto,
} from './dto/order.dto';
import {
  BadRequestExcept,
  InternalServerErrorExcept,
  ResultNotFoundExcept,
} from 'src/errors/exception.error';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly dataSource: DataSource, // Inject DataSource for transactions
    private readonly customerService: CustomerService,
  ) {}

  async createWithCustomer(
    dto: CreateOrderWithCustomerDto,
    baseUrl: string,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const createdCustomer = await this.customerService.register(dto.customer);

      const createOrderDto: CreateOrderDto = {
        customerId: createdCustomer.id,
        employeeId: dto.employeeId,
        items: dto.items,
        notes: dto.notes,
        date: dto.date,
        price: dto.price,
        notes_2: dto.notes_2,
      };

      const order = await this.create(createOrderDto, baseUrl);
      await queryRunner.commitTransaction();
      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async create(
    createOrderDto: CreateOrderDto,
    baseUrl: string,
  ): Promise<OrderEntity> {
    const { customerId, employeeId, items, notes, price, date, notes_2 } =
      createOrderDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customer = await queryRunner.manager.findOneBy(CustEntity, {
        id: customerId,
      });
      if (!customer) throw new ResultNotFoundExcept('Customer with ID');

      let employee: EmployeeEntity | null = null;
      if (employeeId) {
        employee = await queryRunner.manager.findOneBy(EmployeeEntity, {
          id: employeeId,
        });
        if (!employee) {
          throw new ResultNotFoundExcept(
            `Employee with ID "${employeeId}" not found`,
          );
        }
      }

      const orderItems: OrderItemEntity[] = [];

      for (const itemDto of items) {
        const product = await queryRunner.manager.findOneBy(ProductEntity, {
          id: itemDto.productId,
        });
        if (!product) {
          throw new ResultNotFoundExcept(
            `Product with ID "${itemDto.productId}" not found`,
          );
        }

        const orderItem = new OrderItemEntity();
        orderItem.product_id = product.id;
        orderItem.product = product;
        orderItem.quantity = itemDto.quantity;
        orderItem.price_per_unit = 0;
        orderItem.total_price = 0;

        orderItems.push(orderItem);
      }

      if (orderItems.length === 0) {
        throw new BadRequestExcept('Order must contain at least one item');
      }

      // Generate Order ID like ORD-00001
      const lastOrder = await queryRunner.manager.findOne(OrderEntity, {
        where: {},
        order: { id: 'DESC' },
      });

      let newOrderNumber = 1;
      if (lastOrder) {
        const lastIdNumber = parseInt(lastOrder.id.replace('ORD-', ''), 10);
        if (!isNaN(lastIdNumber)) {
          newOrderNumber = lastIdNumber + 1;
        }
      }

      const generatedOrderId = `ORD-${newOrderNumber.toString().padStart(5, '0')}`;

      const order = new OrderEntity();
      order.id = generatedOrderId;
      order.customer_id = customer.id;
      order.customer = customer;
      if (employee) {
        order.employee_id = employee.id;
        order.employee = employee;
      }
      order.status = OrderStatus.COMPLETED;
      order.total_amount = price;
      order.notes = notes;
      order.items = orderItems;
      order.date = date;
      order.notes_2 = notes_2;
      const savedOrder = await queryRunner.manager.save(OrderEntity, order);

      await queryRunner.commitTransaction();
      return this.findOne(savedOrder.id, baseUrl);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof ResultNotFoundExcept ||
        error instanceof BadRequestExcept
      ) {
        throw error;
      }
      console.error('Error creating order:', error);
      throw new InternalServerErrorExcept('Failed to create order');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    page = 1,
    pageSize = 10,
    baseUrl: string,
    sortBy: string = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ data: OrderEntity[]; total: number }> {
    // Validate sortBy field to prevent SQL injection
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'id',
      'total_amount',
      'status',
      'date',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder)
      ? sortOrder
      : 'DESC';

    const [data, total] = await this.orderRepository.findAndCount({
      relations: ['customer', 'employee', 'items', 'items.product'],
      order: { [validSortBy]: validSortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    if (data.length === 0) return { data, total };
    // ดึง uploads ทีเดียว
    const orderIds = data.map((order) => order.id);
    const uploads = await this.dataSource
      .getRepository(UploadEntity)
      .createQueryBuilder('upload')
      .where('upload.owner_type = :ownerType', { ownerType: 'order' })
      .andWhere('upload.owner_id IN (:...orderIds)', { orderIds })
      .getMany();
    for (const order of data) {
      order.uploads = uploads
        .filter((u) => u.owner_id === order.id)
        .map((u) => ({
          ...u,
          url: `${baseUrl}/${u.path}`,
        }));
    }

    return { data, total };
  }

  async findOne(id: string, baseUrl: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['customer', 'employee', 'items', 'items.product'],
    });
    if (!order) {
      throw new ResultNotFoundExcept(`Order with ID "${id}" not found`);
    }
    // ดึง uploads ของ order นี้
    const uploads = await this.dataSource
      .getRepository(UploadEntity)
      .createQueryBuilder('upload')
      .where('upload.owner_type = :ownerType', { ownerType: 'order' })
      .andWhere('upload.owner_id = :orderId', { orderId: order.id })
      .getMany();
    order.uploads = uploads.map((u) => ({
      ...u,
      url: `${baseUrl}/${u.path}`,
    }));

    return order;
  }

  async updateStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    baseUrl: string,
  ): Promise<OrderEntity> {
    const order = await this.findOne(id, baseUrl); // Reuse findOne to check existence

    order.status = updateOrderStatusDto.status;
    order.updated_at = new Date(); // Manually update if not auto-updating

    await this.orderRepository.save(order);
    return this.findOne(id, baseUrl); // Return updated order with relations
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id); // Cascade delete should handle items
    if (result.affected === 0)
      throw new ResultNotFoundExcept(`Order with ID "${id}" not found`);
  }

  async searchOrders(
    filters: {
      orderId?: string;
      customerId?: string;
      customerName?: string; // fullname หรือ nickname
      employeeId?: string;
      status?: OrderStatus;
    },
    page = 1,
    pageSize = 10,
    baseUrl: string,
    sortBy: string = 'created_at',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): Promise<{ data: OrderEntity[]; total: number }> {
    // Validate sortBy field to prevent SQL injection
    const allowedSortFields = [
      'created_at',
      'updated_at',
      'id',
      'total_amount',
      'status',
      'date',
    ];
    const validSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : 'created_at';
    const validSortOrder = ['ASC', 'DESC'].includes(sortOrder)
      ? sortOrder
      : 'DESC';

    const queryBuilder = this.dataSource
      .getRepository(OrderEntity)
      .createQueryBuilder('order');

    queryBuilder
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.employee', 'employee')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (filters.orderId) {
      queryBuilder.andWhere('order.id = :orderId', {
        orderId: filters.orderId,
      });
    }

    if (filters.customerId) {
      queryBuilder.andWhere('order.customer_id = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters.customerName) {
      queryBuilder.andWhere(
        '(customer.fullname LIKE :customerName OR customer.nickname LIKE :customerName)',
        { customerName: `%${filters.customerName}%` },
      );
    }

    if (filters.employeeId) {
      queryBuilder.andWhere('order.employee_id = :employeeId', {
        employeeId: filters.employeeId,
      });
    }

    if (filters.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: filters.status,
      });
    }

    queryBuilder
      .orderBy(`order.${validSortBy}`, validSortOrder)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [data, total] = await queryBuilder.getManyAndCount();
    if (data.length === 0) return { data, total };
    // ดึง uploads ทีเดียว
    const orderIds = data.map((order) => order.id);
    const uploads = await this.dataSource
      .getRepository(UploadEntity)
      .createQueryBuilder('upload')
      .where('upload.owner_type = :ownerType', { ownerType: 'order' })
      .andWhere('upload.owner_id IN (:...orderIds)', { orderIds })
      .getMany();
    for (const order of data) {
      order.uploads = uploads
        .filter((u) => u.owner_id === order.id)
        .map((u) => ({
          ...u,
          url: `${baseUrl}/${u.path}`,
        }));
    }

    return { data, total };
  }
}
