import {Global, Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {WechatOrderController} from './wechat.order.controller';

@Global()
@Module({
  controllers: [OrderController, WechatOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
