import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MessagingModule } from '../../messaging/messaging.module';
import { Order, OrderSchema } from '../../infrastructure/database/schemas/order.schema';
import {
  OrderStatusHistory,
  OrderStatusHistorySchema,
} from '../../infrastructure/database/schemas/order-status-history.schema';

@Module({
  imports: [
    MessagingModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderStatusHistory.name, schema: OrderStatusHistorySchema },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
