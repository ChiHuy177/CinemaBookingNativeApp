using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.DTOs
{
    public class Combo
    {
        public class ComboDTO
        {
            public long ComboId { get; set; }

            public string Name { get; set; }

            public string ImageURL { get; set; }

            public int Quantity { get; set; }

            public double Price { get; set; }
        }

        public class ComboInTicketDTO
        {
            public long ComboId { get; set; }

            public int Quantity { get; set; }

            public string Name { get; set; }
        }

        public class UnAvailableComboDTO
        {
            public long ComboId { get; set; }

            public string Name { get; set; }
        }
    }
}
