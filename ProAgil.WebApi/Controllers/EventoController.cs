using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.Domain;
using ProAgil.Repository;
using ProAgil.WebApi.Dtos;

namespace ProAgil.WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public readonly IProAgilRepository _repo;

        public readonly IMapper _mapper;

        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsync(false);
                
                var results = _mapper.Map<EventoDto[]>(eventos);                
                
                return Ok(results);
            }
            catch (System.Exception o)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, o.Message);
            }
        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await _repo.GetAllEventoAsyncById(EventoId,false);
                
                var results = _mapper.Map<EventoDto>(evento);
                
                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

        }

        [HttpGet("getByTema/{tema}")]
        public async Task<IActionResult> Get(string tema)
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsyncByTema(tema,false);

                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de Dados Falhou");
            }

        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {
                var evento = _mapper.Map<Evento>(model);
                
                _repo.Add(evento);

                if(await _repo.SaveChangesAssync())
                {
                    return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception erro)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, erro.InnerException);
            }

            return BadRequest();
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId,EventoDto model)
        {
            try
            {
                var evento = await _repo.GetAllEventoAsyncById(EventoId,false);
                if(evento == null) return NotFound();
                
                _mapper.Map(model,evento);
                _repo.Update(evento);
                
                if(await _repo.SaveChangesAssync())
                {
                    return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception error)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, error.Message);
            }

            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repo.GetAllEventoAsyncById(EventoId,false);
                if(evento == null) return NotFound();
                
                _repo.Delete(evento);

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