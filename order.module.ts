import {Global, Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';

@Global()
@Module({
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
