import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderItemDocument = HydratedDocument<OrderItem>;

@Schema({ _id: false })
class ItemCustomizationDetails {
  @Prop() colors?: string;

  @Prop() garniture?: string;

  @Prop() message?: string;
}

@Schema()
export class OrderItem {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: string;

  @Prop({ type: String, required: true })
  productId: string;

  @Prop({ type: Number, required: true })
  quantity: number;

  @Prop({ type: ItemCustomizationDetails, _id: false })
  customizationDetails?: ItemCustomizationDetails;

  @Prop({ type: Number, required: true })
  price: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

