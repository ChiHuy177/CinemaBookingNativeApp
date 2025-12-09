using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class Combo
    {
        [Key]
        public long ComboId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        public bool Status { get; set; }

        [StringLength(500)]
        public string ImageURL { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        [Required]
        public double Price { get; set; }

        public ICollection<ComboTicket> ComboTickets { get; set; }
    }
}
