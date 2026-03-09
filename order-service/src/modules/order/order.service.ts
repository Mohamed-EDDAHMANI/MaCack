import { Injectable, Logger, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { INVENTORY_CLIENT, INVENTORY_PATTERNS } from '../../messaging/constants';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '../../services/redis.service';

@Injectable()
export class OrderService {
  public readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly redisService: RedisService,
    @Inject(INVENTORY_CLIENT) private readonly inventoryClient: ClientProxy,
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    this.logger.log(`Creating order for user ${createOrderDto.userId}`);

    // 0. Pre-check Availability
    for (const item of createOrderDto.items) {
      const cacheKey = `inventory:${item.productId}`;
      // Check Redis first
      const cachedValue = await this.redisService.getClient().get(cacheKey);
      let availableQuantity;

      if (cachedValue) {
        try {
          const parsed = JSON.parse(cachedValue);
          availableQuantity = parsed.quantity;
        } catch (e) {
          availableQuantity = Number(cachedValue);
        }
      } else {
        // Not in cache, ask Inventory Service
        this.logger.debug(`Cache miss for ${item.productId}, asking Inventory Service...`);
        try {
          const response = await firstValueFrom(
            this.inventoryClient.send(INVENTORY_PATTERNS.FIND_BY_SKU, { sku: `PROD-${item.productId}` })
          );

          if (response && response.success && response.data) {
            availableQuantity = response.data.quantity;
            this.logger.debug(`Caching inventory for ${item.productId}: ${JSON.stringify(availableQuantity)}`);
            await this.redisService.getClient().set(cacheKey, JSON.stringify(availableQuantity));
          } else {
            throw new BadRequestException(`Product ${item.productId} not found`);
          }

        } catch (error) {
          this.logger.error(`Failed to check stock for ${item.productId}: ${error.message}`);
          throw new BadRequestException(`Unable to verify stock for ${item.productId}`);
        }
      }

      if (Number(availableQuantity || 0) < item.quantity) {
        throw new BadRequestException(`Insufficient stock for product ${item.productId}. Requested: ${item.quantity}, Available: ${availableQuantity}`);
      }
    }


    // 1. Persist Order in DB (Mongo) – not implemented yet
    this.logger.warn('OrderService.create: persistence not implemented yet for MongoDB');
    return {
      success: true,
      message: 'Order created (stub, persistence not implemented yet)',
      data: {
        id: 'stub',
        userId: createOrderDto.userId,
        totalPrice: createOrderDto.totalPrice || 0,
        status: 'PENDING',
        items: createOrderDto.items,
        createdAt: new Date(),
      },
    };
  }

  async reserveInventory(order: any) {
    const reservedItems: any[] = [];
    try {
      for (const item of order.items) {

        const payload = {
          sku: item.productId,
          quantity: item.quantity,
          orderId: order.id
        };

        const response = await firstValueFrom(
          this.inventoryClient.send(INVENTORY_PATTERNS.RESERVE, payload)
        );

        if (!response || response.success === false) {
          throw new Error(response?.message || 'Reservation failed');
        }
        reservedItems.push(item);
      }

      return {
        success: true,
        message: 'Inventory reserved',
        data: reservedItems
      };

    } catch (error) {
      this.logger.error(`Failed to reserve inventory for order ${order.id}: ${error.message}`);

      throw new BadRequestException(`Failed to reserve inventory: ${error.message}`);
    }
  }

  async findAll(userId: string, role: string) {
    this.logger.warn('OrderService.findAll: not implemented yet for MongoDB');
    return [];
  }

  findOne(orderId: string) {
    this.logger.warn(`OrderService.findOne: not implemented yet for MongoDB (orderId=${orderId})`);
    return null;
  }

  async remove(orderId: string) {
    this.logger.warn(`OrderService.remove: not implemented yet for MongoDB (orderId=${orderId})`);
    return;
  }
}
