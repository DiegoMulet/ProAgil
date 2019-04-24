using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Repository;
using Microsoft.AspNetCore.Http;
using ProAgil.Domain;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PalestranteController : ControllerBase
    {
        public readonly IProAgilRepository _repo;
        public PalestranteController(IProAgilRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var results = await  _repo.GetAllPalestranteAsync(false);
                return Ok(results);

            }
            catch (System.Exception)
            {           
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
                
            }
        }

        [HttpGet("{PalestranteId}")]
        public async Task<IActionResult> Get(int PalestranteId)
        {
            try
            {
                var result = await _repo.GetAllPalestranteAsyncById(PalestranteId,true);
                return Ok(result);                
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

        }

        [HttpGet("{nome}")]
        public async Task<IActionResult> Get(string nome)
        {
            try
            {
                var results = await _repo.GetAllPalestranteAsyncByName(nome,true);
                return Ok(results);                
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

        }

        [HttpPost]
        public async Task<IActionResult> Post(Palestrante model)
        {
            try
            {
                _repo.Add(model);

                if(await _repo.SaveChangesAssync())
                {
                    return Created($"api/palestrante/{model.Id}",model);
                } 
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }

        [HttpPut]
        public async Task<IActionResult> Put(int PalestranId,Palestrante model)
        {
            try
            {
                var palestrante = await _repo.GetAllPalestranteAsyncById(PalestranId,false);
                if(palestrante == null) return NotFound(); 
                
                _repo.Update(model);

                if(await _repo.SaveChangesAssync())
                {
                    return Created($"api/palestrante/{model.Id}",model);
                } 
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete(int PalestranId)
        {
            try
            {
                var palestrante = await _repo.GetAllPalestranteAsyncById(PalestranId,false);
                if(palestrante == null) return NotFound(); 
                
                _repo.Delete(palestrante);

                if(await _repo.SaveChangesAssync())
                {
                    return Ok();
                } 
            }
            catch (System.Exception)
            {                
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

            return BadRequest();
        }

    }
}