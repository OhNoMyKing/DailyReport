export class CreatePaymentDto{
    orderId : number;
    userId: number;
    amount: number;
    paymentMethodId: number;
}