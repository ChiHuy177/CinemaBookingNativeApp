using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class ShowingTime
    {
        [Key]
        public long ShowingTimeId { get; set; }

        public DateTime StartTime { get; set; }

        // Foreign keys
        public long MovieId { get; set; }
        public long RoomId { get; set; }

        // Navigation properties
        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; }

        public ICollection<Ticket> Tickets { get; set; }
    }
}
