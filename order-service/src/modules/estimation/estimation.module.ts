import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Estimation, EstimationSchema } from '../../infrastructure/database/schemas/estimation.schema';
import { EstimationController } from './estimation.controller';
import { EstimationService } from './estimation.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Estimation.name, schema: EstimationSchema },
    ]),
    OrderModule,
  ],
  controllers: [EstimationController],
  providers: [EstimationService],
  exports: [EstimationService],
})
export class EstimationModule {}
