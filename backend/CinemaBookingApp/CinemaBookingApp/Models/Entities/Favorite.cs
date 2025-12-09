using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class Favorite
    {
        [Key]
        public long FavoriteId { get; set; }

        public long MovieId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        public long ClientId { get; set; }

        [ForeignKey("ClientId")]
        public Client Client { get; set; }
    }
}
