using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Rank
    {
        [Key]
        public long RankId { get; set; }

        [Required]
        public double RequirePoint { get; set; }

        [Required]
        public double Discount { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public ICollection<Client> Clients { get; set; }
    }
}
