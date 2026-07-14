import { useEffect, useState } from 'react'

type Pessoa = {
  id: number
  nome: string
  idade: number
}

type Transacao = {
  id: number
  descricao: string
  valor: number
  tipo: string
  pessoaId: number
}

type TotalPessoa = {
  pessoaId: number
  nome: string
  totalReceitas: number
  totalDespesas: number
  saldo: number
}

type Totais = {
  pessoas: TotalPessoa[]
  totalGeral: {
    totalReceitas: number
    totalDespesas: number
    saldo: number
  }
}

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('despesa')
  const [pessoaId, setPessoaId] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [totais, setTotais] = useState<Totais | null>(null)

  async function carregarTransacoes() {
    const resposta = await fetch('http://localhost:5021/transacoes')
    const dados = await resposta.json()
    setTransacoes(dados)
  }

  async function carregarPessoas() {
    const resposta = await fetch('http://localhost:5021/pessoas')
    const dados = await resposta.json()
    setPessoas(dados)
  }

  async function cadastrarPessoa(evento: React.FormEvent) {
    evento.preventDefault()

    await fetch('http://localhost:5021/pessoas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        idade: Number(idade),
      }),

    })

    setNome('')
    setIdade('')
    carregarPessoas()
    carregarTotais()
  }

  async function excluirPessoa(id: number) {
    await fetch(`http://localhost:5021/pessoas/${id}`, {
      method: 'DELETE',
    })

    carregarPessoas()
    carregarTransacoes()
    carregarTotais()
  }

  async function cadastrarTransacao(evento: React.FormEvent) {
    evento.preventDefault()

    const resposta = await fetch('http://localhost:5021/transacoes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descricao,
        valor: Number(valor),
        tipo,
        pessoaId: Number(pessoaId),
      }),
    })

    if (!resposta.ok) {
      const erro = await resposta.text()
      setMensagem(erro)
      return
    }

    setDescricao('')
    setValor('')
    setTipo('despesa')
    setPessoaId('')
    setMensagem('Transação cadastrada com sucesso.')

    carregarTransacoes()
    carregarTotais()
  }

  async function carregarTotais() {
    const resposta = await fetch('http://localhost:5021/totais')
    const dados = await resposta.json()
    setTotais(dados)
  }

  useEffect(() => {
    carregarPessoas()
    carregarTransacoes()
    carregarTotais()
  }, [])

  return (
    <main className="dashboard">
      <header className="cabecalho">
        <div>
          <p className="subtitulo">Visão geral</p>
          <h1>Controle de Gastos Residenciais</h1>
          <p>Gerencie pessoas, receitas, despesas e saldos.</p>
        </div>
      </header>

      {totais && (
        <section className="resumo">
          <article className="card resumo-card">
            <span>Total de receitas</span>
            <strong className="receita">
              R$ {totais.totalGeral.totalReceitas.toFixed(2)}
            </strong>
          </article>

          <article className="card resumo-card">
            <span>Total de despesas</span>
            <strong className="despesa">
              R$ {totais.totalGeral.totalDespesas.toFixed(2)}
            </strong>
          </article>

          <article className="card resumo-card">
            <span>Saldo geral</span>
            <strong className={totais.totalGeral.saldo >= 0 ? 'receita' : 'despesa'}>
              R$ {totais.totalGeral.saldo.toFixed(2)}
            </strong>
          </article>

          <article className="card resumo-card">
            <span>Pessoas cadastradas</span>
            <strong>{pessoas.length}</strong>
          </article>
        </section>
      )}
      <section className="card">
        <h2>Cadastro de Pessoas</h2>
        <form onSubmit={cadastrarPessoa}>
          <label>
            Nome
            <input
              type="text"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
            />
          </label>

          <label>
            Idade
            <input
              type="number"
              value={idade}
              onChange={(evento) => setIdade(evento.target.value)}
            />
          </label>

          <button type="submit">Cadastrar</button>
        </form>
      </section>

      <section className="card">
        <h2>Pessoas Cadastradas</h2>

        {pessoas.length === 0 ? (
          <p>Nenhuma pessoa cadastrada.</p>
        ) : (
          <ul>
            {pessoas.map((pessoa) => (
              <li key={pessoa.id}>
                {pessoa.nome} - {pessoa.idade} anos
                <button onClick={() => excluirPessoa(pessoa.id)}>
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Cadastro de Transações</h2>

        <form onSubmit={cadastrarTransacao}>
          <label>
            Descrição
            <input
              type="text"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
            />
          </label>

          <label>
            Valor
            <input
              type="number"
              step="0.01"
              value={valor}
              onChange={(evento) => setValor(evento.target.value)}
            />
          </label>

          <label>
            Tipo
            <select
              value={tipo}
              onChange={(evento) => setTipo(evento.target.value)}
            >
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
          </label>

          <label>
            Pessoa
            <select
              value={pessoaId}
              onChange={(evento) => setPessoaId(evento.target.value)}
            >
              <option value="">Selecione uma pessoa</option>

              {pessoas.map((pessoa) => (
                <option key={pessoa.id} value={pessoa.id}>
                  {pessoa.nome}
                </option>
              ))}
            </select>
          </label>

          <button type="submit">Cadastrar Transação</button>
        </form>

        {mensagem && <p>{mensagem}</p>}
      </section>

      <section className="card">
        <h2>Transações Cadastradas</h2>

        {transacoes.length === 0 ? (
          <p>Nenhuma transação cadastrada.</p>
        ) : (
          <ul>
            {transacoes.map((transacao) => (
              <li key={transacao.id}>
                {transacao.descricao} - R$ {transacao.valor.toFixed(2)} - {transacao.tipo}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2>Consulta de Totais</h2>

        {!totais ? (
          <p>Carregando totais...</p>
        ) : (
          <>
            <ul>
              {totais.pessoas.map((pessoa) => (
                <li key={pessoa.pessoaId}>
                  {pessoa.nome} - Receitas: R$ {pessoa.totalReceitas.toFixed(2)} -
                  Despesas: R$ {pessoa.totalDespesas.toFixed(2)} -
                  Saldo: R$ {pessoa.saldo.toFixed(2)}
                </li>
              ))}
            </ul>

            <h3>Total Geral</h3>

            <p>
              Receitas: R$ {totais.totalGeral.totalReceitas.toFixed(2)}
            </p>

            <p>
              Despesas: R$ {totais.totalGeral.totalDespesas.toFixed(2)}
            </p>

            <p>
              Saldo: R$ {totais.totalGeral.saldo.toFixed(2)}
            </p>
          </>
        )}
      </section>

    </main>
  )
}

export default App