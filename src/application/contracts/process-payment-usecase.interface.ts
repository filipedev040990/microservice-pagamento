export interface Client {
  id: string
  external_code: string
  person_type: string
  document: string
}

export interface Card {
  number: string
  brand: string
  cvv: string
  month: string
  year: string
}

export interface Payment {
  id: string
  installments: number
  attempts_processing: number
  description: string
  value: number
}

export interface PaymentInput {
  client: Client
  card: Card
  payment: Payment
}

export interface ProcessPaymentUseCaseInterface {
  execute(input: ProcessPaymentUseCaseInterface.Input): Promise<ProcessPaymentUseCaseInterface.OutPut>
}

export namespace ProcessPaymentUseCaseInterface {
  export type Input = PaymentInput
  export type OutPut = { payment_id: string, external_code: string, status: string }
}
