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

---

Explicação da Implementação
A implementação do processamento de CSV segue estas decisões importantes:

Otimização de Performance:

Buscamos todas as operadoras relevantes de uma vez só usando $in para melhor performance
Usamos um mapa para armazenar operadoras em memória, evitando múltiplas consultas ao banco
Implementamos inserção em lote com insertMany para eficiência na gravação
Validação e Tratamento de Erros:

Validamos o formato do arquivo CSV e seu conteúdo
Identificamos operadoras desconhecidas para feedback ao usuário
Implementamos tratamento adequado de erros com mensagens significativas
Agregação para o Dashboard:

Usamos pipeline de agregação do MongoDB para calcular estatísticas eficientemente
Implementamos lookup para trazer dados relacionados em uma única consulta
Ordenamos resultados para exibição no ranking
Rastreamento de Resultados:

Incluímos metadados sobre o processamento (registros processados, ignorados, etc.)
Identificamos operadoras não encontradas para permitir correção
Esta implementação completa o fluxo principal do sistema:

Cadastro de operadoras
Upload e processamento de arquivos CSV
Associação de vendas às operadoras
Exibição do ranking e estatísticas
A arquitetura permite escalabilidade e manutenção fácil, seguindo as práticas de design documentadas anteriormente.
