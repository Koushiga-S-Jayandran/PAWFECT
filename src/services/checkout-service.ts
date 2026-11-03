/**
 * Checkout and Idempotency Management Service
 * Guarantees that double-clicks or repeated network submits produce a single atomic order.
 */

import type { Order, Dedication, OrderTimelineEvent } from '../domain/types';
import type { OrderRepository } from '../domain/interfaces';

export interface CheckoutRequest {
  idempotencyKey: string;
  userId: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  shelterId: string;
  shelterName: string;
  giftId: string;
  giftTitle: string;
  amountInPaise: number;
  quantity: number;
  dedication?: Dedication;
  paymentMethod: string;
}

export class CheckoutService {
  private processingKeys: Set<string> = new Set();
  private completedOrdersByIdempotency: Map<string, Order> = new Map();

  constructor(private readonly orderRepository: OrderRepository) {}

  async processCheckout(request: CheckoutRequest): Promise<Order> {
    if (!request.idempotencyKey) {
      throw new Error('An idempotency key is required to execute payment.');
    }

    // Check if order with this key was already created
    const existing = this.completedOrdersByIdempotency.get(request.idempotencyKey);
    if (existing) {
      return existing;
    }

    // Prevent concurrent in-flight double submission with same key
    if (this.processingKeys.has(request.idempotencyKey)) {
      throw new Error('Payment processing in progress. Please do not submit again.');
    }

    this.processingKeys.add(request.idempotencyKey);

    try {
      const order = await this.orderRepository.createOrder({
        idempotencyKey: request.idempotencyKey,
        userId: request.userId,
        donorName: request.donorName,
        donorPhone: request.donorPhone,
        donorEmail: request.donorEmail,
        shelterId: request.shelterId,
        shelterName: request.shelterName,
        giftId: request.giftId,
        giftTitle: request.giftTitle,
        amountInPaise: request.amountInPaise * request.quantity,
        quantity: request.quantity,
        dedication: request.dedication,
        paymentMethod: request.paymentMethod,
      });

      this.completedOrdersByIdempotency.set(request.idempotencyKey, order);
      return order;
    } finally {
      this.processingKeys.delete(request.idempotencyKey);
    }
  }
}
