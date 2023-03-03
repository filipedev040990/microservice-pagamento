import { Card, PaymentInput, ProcessPaymentUseCaseInterface } from '@/application/interfaces/process-payment-usecase.interface'
import { PaymentGateway } from '@/application/interfaces/payment-gateway.interface'

export interface ProcessPaymentInput {
  client: { document: string }
  card: Card
  payment: { installments: number, value: number }
}

export class ProcessPaymentUseCase implements ProcessPaymentUseCaseInterface {
  constructor (private readonly paymentGateway: PaymentGateway) { }
  async execute (input: PaymentInput): Promise<void> {
    const payload = this.makePayload(input)
    await this.paymentGateway.process(payload)
  }

  private makePayload (input: PaymentInput): ProcessPaymentInput {
    return {
      client: {
        document: input.client.document
      },
      card: input.card,
      payment: {
        installments: input.payment.installments,
        value: input.payment.value
      }
    }
  }
}
