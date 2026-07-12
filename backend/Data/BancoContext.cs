using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public class BancoContext : DbContext
{
    public BancoContext(DbContextOptions<BancoContext> options) : base(options)
{
}
    public DbSet<Pessoa> Pessoas { get; set;}
    public DbSet<Transacao> Transacoes { get; set; }
}