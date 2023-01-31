# Consumir fila payments_processing

> ## Caso de sucesso

1. ⛔ Consome dados da fila 'payments_processing'
2. ⛔ 'Processa' o pagamento
3. ⛔ Publica o resultado na fila 'payments_processed'

> ## Exceções
1. ⛔ Salva um log se der erro ao tentar processar o pagamento

✅
⛔