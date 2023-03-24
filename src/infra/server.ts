import 'module-alias/register'
import { app } from './app'
import config from './config'
import { consumeQueuePaymentsProcessing } from '@/infra/queue/consume-payments-processing'

const start = async (): Promise<void> => {
  try {
    const port = config.server.port || 3333
    app.listen(port, () => console.log(`Server running at ${port}`))
    await consumeQueuePaymentsProcessing()
  } catch (error) {
    console.log(error)
  }
}

void start()
