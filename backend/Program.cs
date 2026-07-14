using backend.Models;
using backend.Data;
using Microsoft.EntityFrameworkCore;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<BancoContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "Controle de Gastos API");
    });
}


using (var scope = app.Services.CreateScope())
{
    var banco = scope.ServiceProvider.GetRequiredService<BancoContext>();
    banco.Database.EnsureCreated();
}

app.MapGet("/pessoas", async (BancoContext banco) =>
{
    var pessoas = await banco.Pessoas.ToListAsync();

    return Results.Ok(pessoas);
});

app.MapPost("/pessoas", async (Pessoa pessoa, BancoContext banco) =>
{
    if (string.IsNullOrWhiteSpace(pessoa.Nome))
    {
        return Results.BadRequest("O nome é obrigatório.");
    }

    if (pessoa.Idade < 0)
    {
        return Results.BadRequest("A idade não pode ser negativa.");
    }

    banco.Pessoas.Add(pessoa);
    await banco.SaveChangesAsync();

    return Results.Created($"/pessoas/{pessoa.Id}", pessoa);
});

app.MapDelete("/pessoas/{id}", async (int id, BancoContext banco) =>
{
    var pessoa = await banco.Pessoas.FindAsync(id);

    if (pessoa == null)
    {
        return Results.NotFound("Pessoa não encontrada.");
    }

    var transacoesDaPessoa = await banco.Transacoes
        .Where(transacao => transacao.PessoaId == id)
        .ToListAsync();

    banco.Transacoes.RemoveRange(transacoesDaPessoa);
    banco.Pessoas.Remove(pessoa);

    await banco.SaveChangesAsync();

    return Results.NoContent();
});

app.MapPost("/transacoes", async (Transacao transacao, BancoContext banco) =>
{
    if (string.IsNullOrWhiteSpace(transacao.Descricao))
    {
        return Results.BadRequest("A descrição é obrigatória.");
    }

    if (transacao.Valor <= 0)
    {
        return Results.BadRequest("O valor deve ser maior que zero.");
    }

    if (transacao.Tipo != "receita" && transacao.Tipo != "despesa")
    {
        return Results.BadRequest("O tipo deve ser receita ou despesa.");
    }

    var pessoa = await banco.Pessoas.FindAsync(transacao.PessoaId);

    if (pessoa == null)
    {
        return Results.BadRequest("A pessoa informada não existe.");
    }

    if (pessoa.Idade < 18 && transacao.Tipo == "receita")
    {
        return Results.BadRequest("Menores de idade só podem cadastrar despesas.");
    }

    banco.Transacoes.Add(transacao);
    await banco.SaveChangesAsync();

    return Results.Created($"/transacoes/{transacao.Id}", transacao);
});

app.MapGet("/transacoes", async (BancoContext banco) =>
{
    var transacoes = await banco.Transacoes.ToListAsync();

    return Results.Ok(transacoes);
});


app.MapGet("/totais", async (BancoContext banco) =>
{
    var pessoas = await banco.Pessoas.ToListAsync();
    var transacoes = await banco.Transacoes.ToListAsync();

    var totaisPessoas = new List<object>();

    decimal totalReceitasGeral = 0;
    decimal totalDespesasGeral = 0;

    foreach (var pessoa in pessoas)
    {
        decimal totalReceitas = 0;
        decimal totalDespesas = 0;

        foreach (var transacao in transacoes)
        {
            if (transacao.PessoaId == pessoa.Id)
            {
                if (transacao.Tipo == "receita")
                {
                    totalReceitas += transacao.Valor;
                }

                if (transacao.Tipo == "despesa")
                {
                    totalDespesas += transacao.Valor;
                }
            }
        }

        decimal saldo = totalReceitas - totalDespesas;

        totaisPessoas.Add(new
        {
            pessoaId = pessoa.Id,
            nome = pessoa.Nome,
            totalReceitas,
            totalDespesas,
            saldo
        });

        totalReceitasGeral += totalReceitas;
        totalDespesasGeral += totalDespesas;
    }

    decimal saldoGeral = totalReceitasGeral - totalDespesasGeral;

    return Results.Ok(new
    {
        pessoas = totaisPessoas,
        totalGeral = new
        {
            totalReceitas = totalReceitasGeral,
            totalDespesas = totalDespesasGeral,
            saldo = saldoGeral
        }
    });
});

app.Run();