import {Global, Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {ProductController} from './product/product.controller';
import {WechatOrderController} from './wechat-order/wechat-order.controller';

@Global()
@Module({
  controllers: [OrderController, ProductController, WechatOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
