import { mock, MockProxy } from 'jest-mock-extended'

export type Client = {
    id: string
    email: string
    person_type: string
    document: string
}

export type Card = {
    number: string
    brand: string
    cvv: string
    month: string
    year: string
}

export type Payment = {
    id: string
    installments: number
    attempts_processing: number
    description: string
    value: number
}

export type PaymentInput = {
    client: Client
    card: Card
    payment: Payment
}

export interface ProcessPaymentUseCaseInterface {
    execute(input: PaymentInput): Promise<void>
}


export type ProcessPaymentInput = {
    client: { document: string }
    card: Card
    payment: { installments: number, value: number }
}

export interface PaymentGateway {
    process(input: ProcessPaymentInput): Promise<void>
}


export class ProcessPaymentUseCase implements ProcessPaymentUseCaseInterface {
    constructor(private readonly paymentGateway: PaymentGateway) { }
    async execute(input: PaymentInput): Promise<void> {
        const payload = this.makePayload(input)
        await this.paymentGateway.process(payload)
    }

    private makePayload(input: PaymentInput): ProcessPaymentInput {
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

let fakePayment: PaymentInput
let paymentGateway: MockProxy<PaymentGateway>

describe('ProcessPaymentUseCase', () => {
    beforeAll(() => {
        paymentGateway = mock()
    })
    beforeEach(() => {
        fakePayment = {
            client: {
                id: '0ea0b6f9-8045-45c8-874d-10f20c29f225',
                email: 'filipe.siqueira@hotmail.com.br',
                person_type: 'pf',
                document: '33271619093'
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
    })
    test('should call PaymentGateway.process once and with correct values', async () => {
        const sut = new ProcessPaymentUseCase(paymentGateway)

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
})