import {Global, Module} from '@nestjs/common';
import {OrderController} from './order.controller';
import {OrderService} from './order.service';
import {SkuController} from './sku/sku.controller';
import {WechatOrderController} from './wechat-order/wechat-order.controller';

@Global()
@Module({
  controllers: [OrderController, SkuController, WechatOrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
