import { Connection, Channel, connect } from 'amqplib'
import { QueueInterface } from '@/application/interfaces/queue.interface'

export class RabbitmqAdapter implements QueueInterface {
  private connection: Connection
  private channel: Channel

  constructor (private readonly uri: string) {}

  async start (): Promise<void> {
    this.connection = await connect(this.uri)
    this.channel = await this.connection.createChannel()
  }

  async consume (queue: string, callback: (message: string) => Promise<void>): Promise<void> {
    await this.channel.assertQueue(queue, { durable: true })
    await this.channel.consume(queue, async (message: any) => {
      if (message) {
        await callback(message)
        this.channel.ack(message)
      }
    })
  }

  async publish (exchange: string, routingKey: string, message: string): Promise<boolean> {
    await this.channel.assertExchange(exchange, 'direct', { durable: true })
    return this.channel.publish(exchange, routingKey, Buffer.from(message))
  }

  async close (): Promise<void> {
    await this.channel.close()
  }
}
