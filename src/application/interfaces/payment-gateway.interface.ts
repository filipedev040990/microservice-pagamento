import { ProcessPaymentInput } from '@/application/usecases/process-payment.usecase'

export interface PaymentGateway {
  process(input: PaymentGateway.Input): Promise<PaymentGateway.OutPut>
}

export namespace PaymentGateway {
  export type Input = ProcessPaymentInput
  export type OutPut = { status: string }
}
