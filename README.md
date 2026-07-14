# Controle de Gastos Residenciais

Sistema de controle de gastos residenciais com cadastro de pessoas, cadastro de transações e consulta de totais.

## Tecnologias

### Back-end

![C#](https://img.shields.io/badge/C%23-512BD4?style=for-the-badge&logo=csharp&logoColor=white)
![.NET](https://img.shields.io/badge/.NET%2010-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![Entity Framework Core](https://img.shields.io/badge/Entity%20Framework%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)

### Banco de dados

![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

### Front-end

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Ferramentas

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)

## Estrutura do repositório

```text
controle-gastos-residenciais/
├── backend/
│   ├── Data/
│   │   └── BancoContext.cs
│   ├── Models/
│   │   ├── Pessoa.cs
│   │   └── Transacao.cs
│   ├── Program.cs
│   ├── appsettings.json
│   └── backend.csproj
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Como executar

### Pré-requisitos

- .NET SDK 10
- Node.js
- npm
### 1. Back-end

Entre na pasta do back-end:

```bash
cd backend
```

Restaure os pacotes:

```bash
dotnet restore
```
Execute a API:

```bash
dotnet run
```
A API será iniciada em:

http://localhost:5021

O Swagger estará disponível em:

http://localhost:5021/swagger

Os dados são persistidos em um arquivo SQLite chamado gastos.db, criado automaticamente na primeira execução.

Foi utilizado Database.EnsureCreated() para criar o banco de forma simples e facilitar a execução do projeto.

### 2. Front-end

Em outro terminal, entre na pasta do front-end:

```bash
cd frontend
```
Instale as dependências:

```bash
npm install
```
Execute a aplicação:

```bash
npm run dev
```
O front-end será iniciado em:

http://localhost:5173

O back-end precisa estar rodando para que os dados sejam carregados e cadastrados.

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/pessoas` | Lista todas as pessoas |
| POST | `/pessoas` | Cadastra uma pessoa |
| DELETE | `/pessoas/{id}` | Exclui uma pessoa e suas transações |
| GET | `/transacoes` | Lista todas as transações |
| POST | `/transacoes` | Cadastra uma transação |
| GET | `/totais` | Exibe os totais por pessoa e o total geral |

## Regras de negócio implementadas

- Os identificadores de pessoas e transações são números inteiros gerados automaticamente.
- O nome da pessoa é obrigatório.
- A idade não pode ser negativa.
- O valor da transação deve ser maior que zero.
- O tipo da transação deve ser `receita` ou `despesa`.
- Uma transação só pode ser cadastrada para uma pessoa existente.
- Pessoas menores de 18 anos só podem cadastrar despesas.
- Ao excluir uma pessoa, todas as transações vinculadas a ela também são removidas.
- O saldo é calculado subtraindo as despesas das receitas.
- A consulta de totais apresenta os valores individuais e o total geral.
- Não foi implementada edição ou exclusão de transações, conforme solicitado.

## Decisões técnicas

- **SQLite:** utilizado por ser simples, não exigir instalação de servidor e manter os dados salvos após fechar a aplicação.
- **Entity Framework Core:** utilizado para realizar o acesso ao banco através das classes C#.
- **Minimal API:** utilizada para manter o back-end simples e direto.
- **Swagger:** utilizado para visualizar e testar os endpoints.
- **React com TypeScript:** utilizado para criar a interface e consumir a API.
- **Comentários no código:** adicionados para explicar a responsabilidade dos arquivos e as principais regras de negócio.
- **CORS:** habilitado para permitir a comunicação local entre o React e a API.

## Funcionalidades

- Cadastro de pessoas
- Listagem de pessoas
- Exclusão de pessoas
- Cadastro de transações
- Listagem de transações
- Regra para menores de idade
- Exclusão das transações vinculadas à pessoa
- Consulta de totais por pessoa
- Consulta do total geral
- Persistência com SQLite
- Interface responsiva
- Documentação da API com Swagger
