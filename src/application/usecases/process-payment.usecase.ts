import { Card, PaymentInput, ProcessPaymentUseCaseInterface } from '@/application/contracts/process-payment-usecase.interface'
import { PaymentGatewayInterface } from '@/application/contracts/payment-gateway.interface'

export interface ProcessPaymentInput {
  client: { document: string }
  card: Card
  payment: { installments: number, value: number }
}

export class ProcessPaymentUseCase implements ProcessPaymentUseCaseInterface {
  constructor (private readonly paymentGateway: PaymentGatewayInterface) { }

  async execute (input: PaymentInput): Promise<ProcessPaymentUseCaseInterface.OutPut> {
    const payload = this.makePayload(input)

    const { status } = await this.paymentGateway.process(payload)

    return {
      external_code: input.client.external_code,
      payment_id: input.payment.id,
      client: {
        id: input.client.id,
        external_code: input.client.external_code,
        person_type: input.client.person_type,
        document: input.client.document,
        name: input.client.name,
        phone: input.client.phone,
        email: input.client.email,
        address: {
          cep: input.client.address.cep,
          street: input.client.address.street,
          number: input.client.address.number,
          complement: input.client.address.complement,
          district: input.client.address.district,
          city: input.client.address.city,
          state: input.client.address.state
        }
      },
      status
    }
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
