import { ProcessPaymentInput } from '@/application/usecases/process-payment.usecase'

export interface PaymentGatewayInterface {
  process(input: PaymentGatewayInterface.Input): Promise<PaymentGatewayInterface.OutPut>
}

export namespace PaymentGatewayInterface {
  export type Input = ProcessPaymentInput
  export type OutPut = { status: string }
}
