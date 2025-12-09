using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Review
    {
        [Key]
        public long ReviewId { get; set; }

        public int Rating { get; set; }

        [StringLength(1000)]
        public string Comment { get; set; }

        public DateTime CreatedAt { get; set; }

        // Foreign keys
        public long ClientId { get; set; }
        public long MovieId { get; set; }

        // Navigation properties
        [ForeignKey("ClientId")]
        public Client Client { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }
    }
}
