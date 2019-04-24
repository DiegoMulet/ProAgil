using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        public readonly ProAgilContext _context;

        public ProAgilRepository(ProAgilContext context)
        {
            _context = context;

            //Para não travar o recurso no EF, para todos os métodos
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }

        //Geral
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
         public async Task<bool> SaveChangesAssync()
        {
            return (await _context.SaveChangesAsync()) > 0;
        }

        //Evento
        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrante = false)
        {
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if(includePalestrante)
            {
                query = _context.Eventos
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            } 

            query = query.OrderByDescending(c => c.DataEvento);

            return await query.ToArrayAsync();

        }

        public async Task<Evento> GetAllEventoAsyncById(int EventoId, bool includePalestrante = false)
        {            
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if(includePalestrante)
            {
                //AsNoTracking para não travar o recurso
                query = _context.Eventos.AsNoTracking()
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            } 

            query = query.OrderByDescending(c => c.DataEvento)
                    .Where(c => c.Id == EventoId);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrante = false)
        {
            
            IQueryable<Evento> query = _context.Eventos
                .Include(c => c.Lotes)
                .Include(c => c.RedesSociais);

            if(includePalestrante)
            {
                query = _context.Eventos
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Palestrante);
            } 

            query = query.OrderByDescending(c => c.DataEvento)
                    .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));

            return await query.ToArrayAsync();
        }

        //Palestrante
        public async Task<Palestrante[]> GetAllPalestranteAsyncByName(string nome, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedesSociais);
            
            if(includeEventos)
            {
                query = _context.Palestrantes
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.OrderBy(c => c.Nome)
                .Where(c => c.Nome.ToLower().Contains(nome.ToLower()));

            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetAllPalestranteAsyncById(int PalestrandeId, bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(c => c.RedesSociais);
            
            if(includeEventos)
            {
                query = _context.Palestrantes
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(e => e.Evento);
            }

            query = query.Where(p => p.Id == PalestrandeId);

            return await query.FirstOrDefaultAsync();
        }
        public async Task<Palestrante[]> GetAllPalestranteAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _context.Palestrantes
                .Include(p => p.RedesSociais);
            
            if(includeEventos)
            {
                query = _context.Palestrantes
                    .Include(pe => pe.PalestrantesEventos)
                    .ThenInclude(p => p.Evento);
            }

            query =  query.OrderBy(p => p.Nome);

            return await query.ToArrayAsync();
        }
    }
}