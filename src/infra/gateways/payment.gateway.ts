import { PaymentGatewayInterface } from '@/application/interfaces/payment-gateway.interface'
import { ProcessPaymentInput } from '@/application/usecases'
import { sleep } from '@/shared/helpers/sleep'

export class PaymentGateway implements PaymentGatewayInterface {
  async process (input: ProcessPaymentInput): Promise<PaymentGatewayInterface.OutPut> {
    await sleep(30000)

    const { card } = input

    const lastCardNumber: string = card.number.slice(-1)
    const numbersToApproveTransaction: string [] = ['2', '4', '6', '8']

    const status = numbersToApproveTransaction.includes(lastCardNumber) ? 'confirmed' : 'repproved'

    return { status }
  }
}
