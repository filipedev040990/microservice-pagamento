import { ProcessPaymentUseCaseInterface } from '@/application/interfaces/process-payment-usecase.interface'
import { ProcessPaymentUseCase } from '@/application/usecases'
import { RabbitmqAdapter } from '@/infra/adapters/rabbitmq.adapter'
import config from '@/infra/config'
import { PaymentGateway } from '@/infra/gateways/payment.gateway'

export const consumeQueuePaymentsProcessing = async (): Promise<void> => {
  try {
    let paymentProcessed: ProcessPaymentUseCaseInterface.OutPut
    const queue = new RabbitmqAdapter(config.rabbitmq.uri)
    await queue.start()
    await queue.consume('payments_processing', async (message: any) => {
      const payment = JSON.parse(message.content.toString())

      const paymentGateway = new PaymentGateway()
      const processPayment = new ProcessPaymentUseCase(paymentGateway)

      paymentProcessed = await processPayment.execute(payment)

      const payload = JSON.stringify(paymentProcessed)
      await queue.publish('payments_processed', 'payments_processed', payload)
    })
  } catch (error) {
    console.log(error)
  }
}
