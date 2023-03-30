import { mock, MockProxy } from 'jest-mock-extended'
import { PaymentInput, ProcessPaymentUseCaseInterface } from '@/application/contracts/process-payment-usecase.interface'
import { ProcessPaymentUseCase } from '@/application/usecases/process-payment.usecase'
import { PaymentGatewayInterface } from '../contracts/payment-gateway.interface'

let fakePayment: PaymentInput
let paymentGateway: MockProxy<PaymentGatewayInterface>
let sut: ProcessPaymentUseCaseInterface

describe('ProcessPaymentUseCase', () => {
  beforeAll(() => {
    paymentGateway = mock()
    sut = new ProcessPaymentUseCase(paymentGateway)
  })
  beforeEach(() => {
    fakePayment = {
      client: {
        id: '0ea0b6f9-8045-45c8-874d-10f20c29f225',
        external_code: 'anyExternalCode',
        person_type: 'pf',
        document: '33271619093',
        name: 'Zé das Couves',
        phone: '32999651201',
        email: 'anyEmail',
        address: {
          cep: '36200000',
          street: 'Rua Vitório Meneghin',
          number: '167',
          complement: 'Apto 204',
          district: 'Centro',
          city: 'Barbacena',
          state: 'MG'
        }
      },
      card: {
        number: '5201248356233412',
        brand: 'visa',
        cvv: '123',
        month: '05',
        year: '2025'
      },
      payment: {
        id: 'be52a0d7-61e5-4d77-80b5-215b2bd26f3e',
        installments: 12,
        attempts_processing: 0,
        description: 'Compra de curso',
        value: 1200
      }
    }
    paymentGateway.process.mockResolvedValue({ status: 'approved' })
  })

  test('should call PaymentGateway.process once and with correct values', async () => {
    await sut.execute(fakePayment)

    expect(paymentGateway.process).toHaveBeenCalledTimes(1)
    expect(paymentGateway.process).toHaveBeenCalledWith({
      client: {
        document: fakePayment.client.document
      },
      card: fakePayment.card,
      payment: {
        installments: fakePayment.payment.installments,
        value: fakePayment.payment.value
      }
    })
  })

  test('should return PaymentGateway response correctly', async () => {
    const response = await sut.execute(fakePayment)

    expect(response).toEqual({
      payment_id: 'be52a0d7-61e5-4d77-80b5-215b2bd26f3e',
      external_code: 'anyExternalCode',
      client: {
        address: {
          cep: '36200000',
          city: 'Barbacena',
          complement: 'Apto 204',
          district: 'Centro',
          number: '167',
          state: 'MG',
          street: 'Rua Vitório Meneghin'
        },
        document: '33271619093',
        external_code: 'anyExternalCode',
        id: '0ea0b6f9-8045-45c8-874d-10f20c29f225',
        name: 'Zé das Couves',
        person_type: 'pf',
        phone: '32999651201',
        email: 'anyEmail'
      },
      status: 'approved'
    })
  })

  test('should rethrow if PaymentGateway throws', async () => {
    paymentGateway.process.mockImplementationOnce(() => {
      throw new Error('external_error')
    })

    const promise = sut.execute(fakePayment)

    await expect(promise).rejects.toThrowError()
  })
})
