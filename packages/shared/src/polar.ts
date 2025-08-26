/*
 * POLAR WEBHOOK TYPES - IMPORTANT NOTE ABOUT CASE CONVERSION
 *
 * Polar's raw API and documentation use snake_case for field names (e.g., product_id, created_at).
 * However, when using Polar's TypeScript SDK (@polar-sh/sdk/webhooks), the validateEvent() function
 * automatically converts all field names from snake_case to camelCase to follow JavaScript/TypeScript
 * naming conventions.
 *
 * This means:
 * - Raw webhook payload: { "product_id": "123", "created_at": "2024-01-01" }
 * - After validateEvent(): { "productId": "123", "createdAt": "2024-01-01" }
 *
 * All interfaces below reflect the CONVERTED camelCase format that you'll actually receive
 * in your webhook handlers when using Polar's TypeScript SDK.
 *
 * According to Polar's docs, they plan to add an option to toggle this behavior in the future
 * to allow using snake_case even in TypeScript for easier mapping to their documentation.
 */

// Address interface used in multiple places
interface Address {
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
}

// Customer interface
interface Customer {
  id: string;
  createdAt: string;
  modifiedAt: string;
  metadata: Record<string, any>;
  externalId: string;
  email: string;
  emailVerified: boolean;
  name: string;
  billingAddress: Address;
  taxId: [string, string]; // [tax_id_value, tax_id_type]
  organizationId: string;
  deletedAt: string | null;
  avatarUrl: string;
}

// Product interface
interface Product {
  metadata: Record<string, any>;
  createdAt: string;
  modifiedAt: string;
  id: string;
  name: string;
  description: string;
  recurringInterval: "month" | "year" | "week" | "day";
  isRecurring: boolean;
  isArchived: boolean;
  organizationId: string;
}

// Discount interface
interface Discount {
  duration: "once" | "repeating" | "forever";
  type: "fixed" | "percentage";
  amount: number;
  currency: string;
  createdAt: string;
  modifiedAt: string;
  id: string;
  metadata: Record<string, any>;
  name: string;
  code: string;
  startsAt: string;
  endsAt: string;
  maxRedemptions: number;
  redemptionsCount: number;
  organizationId: string;
}

// Subscription interface
interface Subscription {
  metadata: Record<string, any>;
  createdAt: string;
  modifiedAt: string;
  id: string;
  amount: number;
  currency: string;
  recurringInterval: "month" | "year" | "week" | "day";
  status:
    | "incomplete"
    | "incomplete_expired"
    | "trialing"
    | "active"
    | "past_due"
    | "canceled"
    | "unpaid";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  startedAt: string;
  endsAt: string | null;
  endedAt: string | null;
  customerId: string;
  productId: string;
  discountId: string | null;
  checkoutId: string;
  customerCancellationReason:
    | "customer_service"
    | "too_expensive"
    | "missing_features"
    | "switched_service"
    | "unused"
    | "other"
    | null;
  customerCancellationComment: string | null;
}

// Order item interface
interface OrderItem {
  createdAt: string;
  modifiedAt: string;
  id: string;
  label: string;
  amount: number;
  taxAmount: number;
  proration: boolean;
  productPriceId: string;
}

// Main order data interface
export interface OrderData {
  id: string;
  createdAt: string;
  modifiedAt: string;
  status: "paid" | "pending" | "failed" | "canceled";
  paid: boolean;
  subtotalAmount: number;
  discountAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  refundedAmount: number;
  refundedTaxAmount: number;
  currency: string;
  billingReason:
    | "purchase"
    | "subscription_create"
    | "subscription_update"
    | "subscription_cycle";
  billingName: string;
  billingAddress: Address;
  isInvoiceGenerated: boolean;
  customerId: string;
  productId: string;
  discountId: string | null;
  subscriptionId: string | null;
  checkoutId: string;
  metadata: Record<string, any>;
  customFieldData: Record<string, any>;
  customer: Customer;
  userId: string;
  product: Product;
  discount: Discount | null;
  subscription: Subscription | null;
  items: OrderItem[];
}

// Main webhook event interface
export interface OrderPaidWebhookEvent {
  type: "order.paid";
  data: OrderData;
}
