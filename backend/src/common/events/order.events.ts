export interface OrderEvent {
  id: string;
  orderId: string;
  type: string;
  timestamp: Date;
  data?: any;
}

export class OrderCreatedEvent implements OrderEvent {
  id: string;
  orderId: string;
  type = 'order.created';
  timestamp: Date;
  data: any;

  constructor(orderId: string, data: any) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.orderId = orderId;
    this.timestamp = new Date();
    this.data = data;
  }
}

export class OrderUpdatedEvent implements OrderEvent {
  id: string;
  orderId: string;
  type = 'order.updated';
  timestamp: Date;
  data: any;

  constructor(orderId: string, data: any) {
    this.id = `${Date.now()}-${Math.random()}`;
    this.orderId = orderId;
    this.timestamp = new Date();
    this.data = data;
  }
}
