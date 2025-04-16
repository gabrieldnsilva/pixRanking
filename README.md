# PIX Ranking Dashboard

Sistema para gerenciamento e visualização de ranking de vendas na modalidade PIX, com processamento de arquivos CSV e cadastro de operadoras.

## Visão Geral

Este projeto consiste em uma aplicação web para:

-   Cadastrar operadoras com nome, matrícula e foto (opcional)
-   Processar arquivos CSV contendo registros de vendas PIX
-   Gerar um dashboard de ranking baseado na quantidade de vendas por operadora
-   Visualizar estatísticas de desempenho

## Tecnologias Utilizadas

-   **Frontend:** React.js com Next.js
-   **Backend:** API Routes do Next.js
-   **Banco de Dados:** MongoDB com Mongoose (ou Prisma)
-   **Processamento de CSV:** Papa Parse
-   **UI/UX:** Tailwind CSS
-   **Gerenciamento de Estado:** React Query
-   **Autenticação:** NextAuth.js (opcional)

## Estrutura do Projeto

```
/app
  /page.tsx                 # Dashboard principal com ranking
  /operators/page.tsx       # Lista de operadoras
  /operators/new/page.tsx   # Formulário para cadastro de operadoras
  /upload/page.tsx          # Página para upload e processamento de CSV
  /api/operators/route.ts   # API para CRUD de operadoras
  /api/upload/route.ts      # API para upload de CSV
  /api/sales/route.ts       # API para dados de vendas processados

/components
  /Dashboard/...            # Componentes do dashboard
  /Operators/...            # Componentes de gestão de operadoras
  /Layout/...               # Layout da aplicação
  /UI/...                   # Componentes reutilizáveis

/lib
  /db.ts                    # Conexão com banco de dados
  /csv-parser.ts            # Lógica de processamento de CSV
  /auth.ts                  # Lógica de autenticação (se necessário)
```

## Fluxo de Dados

1. Cadastro de operadoras no sistema com dados obrigatórios (nome, matrícula)
2. Upload do arquivo CSV contendo dados de vendas individuais
3. Processamento do CSV, associando vendas às operadoras por matrícula
4. Cálculo do ranking baseado na quantidade de vendas PIX por operadora
5. Exibição do dashboard com ranking e estatísticas

## Estrutura do Banco de Dados

### Coleção: Operators

```
{
  id: string,
  name: string,
  registrationNumber: string,
  profileImage: string (opcional),
  createdAt: date,
  updatedAt: date
}
```

### Coleção: Sales

```
{
  id: string,
  operatorId: string (referência a Operators),
  saleDate: date,
  amount: number,
  transactionId: string,
  otherData: mixed,
  createdAt: date,
  updatedAt: date
}
```

## Getting Started

Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## TODO

1. Criação da interface de usuário e componentes
2. Implementação do formulário de cadastro de operadoras
3. Configuração da conexão com o banco de dados
4. Desenvolvimento do sistema de upload e processamento de CSV
5. Implementação da lógica de r'anking e dashboard
6. Testes e refinamento da interface

## Estrutura do Arquivo CSV

O arquivo CSV de vendas deve seguir a estrutura, tabulada por ";"

```
Data Sitef;Operador;Produto;Valor
DD-MM-AAAA;100;Pix;100,43
```

Onde a "Operador" deve corresponder às matrículas cadastradas no sistema.

## Recursos Adicionais

-   [Next.js Documentation](https://nextjs.org/docs)
-   [MongoDB Documentation](https://docs.mongodb.com/)
-   [Papa Parse Documentation](https://www.papaparse.com/docs)
