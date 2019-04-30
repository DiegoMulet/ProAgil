using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebApi.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage="O campo {0} é obrigatótio.")]
        [StringLength(50, MinimumLength=5, ErrorMessage="O campo {0} aceita entre 5 e 50 caracteres.")]
        public string Local { get; set; }
        public string DataEvento { get; set; }  
        public string Tema { get; set; }

        [Range(10,500,ErrorMessage="{0} aceita entre 50 e 100")]
        public int QtdPessoas { get; set; }
        public string ImagemURL { get; set; }
        public string Telefone { get; set; }

        [EmailAddress]
        public string Email { get; set; }
        public List<LoteDto> Lotes { get; set; }
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}