Explicação das Decisões de Design
Padrão Singleton para Conexão MongoDB:

Previne a criação de múltiplas conexões ao banco de dados
Reutiliza a conexão existente entre solicitações da API
Importante para o modelo serverless do Next.js, onde cada função de API pode ser uma instância separada
Esquema Mongoose com Validação:

Validação de dados no nível do schema, garantindo a integridade dos dados
Uso de índices para otimizar consultas frequentes
Adoção do campo único registrationNumber para operadoras, facilitando a associação com registros de vendas
Referência entre Modelos:

O modelo de Sale contém uma referência ao Operator usando operatorId
Também mantém o campo operatorRegistration para facilitar consultas e evitar joins desnecessários
Esta abordagem equilibra normalização com desempenho
Processamento de CSV:

Uso do PapaParse para processamento de arquivos CSV
Validação de dados e normalização antes da inserção no banco
Tratamento de operadoras desconhecidas/não cadastradas
Estatísticas de processamento retornadas para feedback ao usuário
Agregação para Estatísticas:

Uso de agregação do MongoDB para calcular estatísticas de vendas
Permite consultas eficientes para o dashboard de ranking
Joins (lookups) realizados no banco de dados para melhor performance

Explicação da Implementação
API REST Completa:

Implementamos endpoints para todas as operações CRUD:
GET /api/operators: Listar todas as operadoras
POST /api/operators: Criar uma nova operadora
GET /api/operators/[id]: Obter uma operadora específica
PUT /api/operators/[id]: Atualizar uma operadora
DELETE /api/operators/[id]: Excluir uma operadora
Upload de Imagens:

Implementamos o processamento e armazenamento de imagens de perfil
Utilizamos nomes de arquivo únicos para evitar conflitos
Incluímos validação de tipos e tamanhos de arquivos
Validação de Regras de Negócio:

Verificamos se a matrícula já existe antes de cadastrar
Impedimos a exclusão de operadoras com vendas associadas
Validamos dados obrigatórios no backend
Experiência do Usuário:

Adicionamos feedback visual para operações (toasts)
Implementamos tratamento de erros adequado
Adicionamos confirmação para exclusão
Segurança:

Validação de dados no servidor
Limpeza de arquivos não utilizados
