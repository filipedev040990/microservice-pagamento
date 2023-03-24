# Microservice Pagamento
Este microserviço busca pagamentos a serem processados em uma fila rabbitmq <br>
Este microserviço processa o pagamento junto à um "gateway de pagamento" <br>
Este microserviço publica uma mensagem na fila de "payments_processed" com o resultado
