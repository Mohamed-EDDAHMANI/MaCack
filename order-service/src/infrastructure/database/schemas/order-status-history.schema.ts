import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from './order.schema';

export type OrderStatusHistoryDocument = HydratedDocument<OrderStatusHistory>;

@Schema()
export class OrderStatusHistory {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: string;

  @Prop({ type: String, enum: Object.values(OrderStatus), required: true })
  status: OrderStatus;

  @Prop({ type: Date, default: Date.now })
  changedAt: Date;
}

export const OrderStatusHistorySchema = SchemaFactory.createForClass(OrderStatusHistory);

