import { Injectable } from '@nestjs/common';

export interface IEventListener {
  handle(event: any): Promise<void>;
}

@Injectable()
export class EventBus {
  private listeners: Map<string, IEventListener[]> = new Map();

  subscribe(eventType: string, listener: IEventListener): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(listener);
  }

  async publish(event: any): Promise<void> {
    const eventType = event.type;
    const eventListeners = this.listeners.get(eventType) || [];

    for (const listener of eventListeners) {
      try {
        await listener.handle(event);
      } catch (error) {
        console.error(`Error in event listener for ${eventType}:`, error);
      }
    }
  }
}
