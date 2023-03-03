import { ProcessPaymentInput } from '@/application/usecases/process-payment.usecase'

export interface PaymentGateway {
  process(input: ProcessPaymentInput): Promise<void>
}
