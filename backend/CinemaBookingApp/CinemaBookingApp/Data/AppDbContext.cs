using CinemaBookingApp.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
namespace CinemaBookingApp.Data
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            modelBuilder.Entity<Genre>().HasData(
                  new Genre { GenreId = 1, Name = "Hành động" },
                  new Genre { GenreId = 2, Name = "Phiêu lưu" },
                  new Genre { GenreId = 3, Name = "Kinh dị" },
                  new Genre { GenreId = 4, Name = "Hài" },
                  new Genre { GenreId = 5, Name = "Tình cảm" },
                  new Genre { GenreId = 6, Name = "Tâm lý" },
                  new Genre { GenreId = 7, Name = "Gia đình" },
                  new Genre { GenreId = 8, Name = "Hoạt hình" },
                  new Genre { GenreId = 9, Name = "Viễn tưởng" },
                  new Genre { GenreId = 10, Name = "Khoa học viễn tưởng" },
                  new Genre { GenreId = 11, Name = "Kỳ ảo" },
                  new Genre { GenreId = 12, Name = "Tội phạm" },
                  new Genre { GenreId = 13, Name = "Chiến tranh" },
                  new Genre { GenreId = 14, Name = "Hình sự" },
                  new Genre { GenreId = 15, Name = "Lịch sử" },
                  new Genre { GenreId = 16, Name = "Tài liệu" },
                  new Genre { GenreId = 17, Name = "Âm nhạc" },
                  new Genre { GenreId = 18, Name = "Võ thuật" },
                  new Genre { GenreId = 19, Name = "Thể thao" },
                  new Genre { GenreId = 20, Name = "Thần thoại" },
                  new Genre { GenreId = 21, Name = "Chính kịch" },
                  new Genre { GenreId = 22, Name = "Chính trị" },
                  new Genre { GenreId = 23, Name = "Thiếu nhi" },
                  new Genre { GenreId = 24, Name = "Học đường" },
                  new Genre { GenreId = 25, Name = "Kinh điển" },
                  new Genre { GenreId = 26, Name = "Giả tưởng hậu tận thế" },
                  new Genre { GenreId = 27, Name = "Siêu anh hùng" },
                  new Genre { GenreId = 28, Name = "Kịch tính" },
                  new Genre { GenreId = 29, Name = "Trinh thám" },
                  new Genre { GenreId = 30, Name = "Thám hiểm" }
            );

            modelBuilder.Entity<Rank>()
                .HasData(
                    new Rank
                    {
                        RankId = 1,
                        Name = "NONE",
                        Discount = 0,
                        RequirePoint = 0,
                    },
                    new Rank
                    {
                        RankId = 2,
                        Name = "SILVER",
                        Discount = 2.00,
                        RequirePoint = 2000,
                    },
                     new Rank
                     {
                         RankId = 3,
                         Name = "GOLD",
                         Discount = 5.00,
                         RequirePoint = 10000,
                     },
                      new Rank
                      {
                          RankId = 4,
                          Name = "PLATINUM",
                          Discount = 10.00,
                          RequirePoint = 30000,
                      }
            );


            modelBuilder.Entity<Cinema>().HasData(
                 new Cinema
                 {
                     CinemaId = 1,
                     Name = "CGV Aeon Tân Phú",
                     Address = "30 Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú, TP. HCM",
                     Hotline = "19001234",
                     City = "TP. HCM"
                 },
                 new Cinema
                 {
                     CinemaId = 2,
                     Name = "CGV Vincom Đồng Khởi",
                     Address = "72 Lê Thánh Tôn, P. Bến Nghé, Q. 1, TP. HCM",
                     Hotline = "19001234",
                     City = "TP. HCM"
                 },
                 new Cinema
                 {
                     CinemaId = 3,
                     Name = "CGV Giga Mall",
                     Address = "240-242 Phạm Văn Đồng, Thủ Đức, TP. HCM",
                     Hotline = "19001234",
                     City = "TP. HCM"
                 },
                 new Cinema
                 {
                     CinemaId = 4,
                     Name = "CGV Aeon Bình Dương Canary",
                     Address = "1 Đại lộ Bình Dương, Thuận An, Bình Dương",
                     Hotline = "19001234",
                     City = "Bình Dương"
                 },
                 new Cinema
                 {
                     CinemaId = 5,
                     Name = "CGV Crescent Mall",
                     Address = "101 Tôn Dật Tiên, P. Tân Phú, Q.7, TP. HCM",
                     Hotline = "19001234",
                     City = "TP. HCM"
                 },
                 new Cinema
                 {
                     CinemaId = 6,
                     Name = "CGV Vincom Bà Triệu",
                     Address = "191 Bà Triệu, Hai Bà Trưng, Hà Nội",
                     Hotline = "19001234",
                     City = "Hà Nội"
                 },
                 new Cinema
                 {
                     CinemaId = 7,
                     Name = "CGV Times City",
                     Address = "458 Minh Khai, Hai Bà Trưng, Hà Nội",
                     Hotline = "19001234",
                     City = "Hà Nội"
                 },
                 new Cinema
                 {
                     CinemaId = 8,
                     Name = "CGV Vincom Đà Nẵng",
                     Address = "910A Ngô Quyền, Sơn Trà, Đà Nẵng",
                     Hotline = "19001234",
                     City = "Đà Nẵng"
                 }, new Cinema
                 {
                     CinemaId = 9,
                     Name = "CGV Aeon Hà Đông",
                     Address = "Đường Cầu Bươu, P. Kiến Hưng, Hà Đông, Hà Nội",
                     Hotline = "19001234",
                     City = "Hà Nội"
                 },
                new Cinema
                {
                    CinemaId = 10,
                    Name = "CGV Vincom Mega Mall Royal City",
                    Address = "72A Nguyễn Trãi, Thanh Xuân, Hà Nội",
                    Hotline = "19001234",
                    City = "Hà Nội"
                },
                new Cinema
                {
                    CinemaId = 11,
                    Name = "CGV Parkson Hùng Vương",
                    Address = "126 Hồng Bàng, Q.5, TP. HCM",
                    Hotline = "19001234",
                    City = "TP. HCM"
                },
                new Cinema
                {
                    CinemaId = 12,
                    Name = "CGV Nguyễn Chí Thanh",
                    Address = "Tầng 6, 54A Nguyễn Chí Thanh, Hà Nội",
                    Hotline = "19001234",
                    City = "Hà Nội"
                },
                new Cinema
                {
                    CinemaId = 13,
                    Name = "CGV SC VivoCity",
                    Address = "1058 Nguyễn Văn Linh, Q.7, TP. HCM",
                    Hotline = "19001234",
                    City = "TP. HCM"
                },
                new Cinema
                {
                    CinemaId = 14,
                    Name = "CGV Vincom Nguyễn Chí Thanh",
                    Address = "54A Nguyễn Chí Thanh, Đống Đa, Hà Nội",
                    Hotline = "19001234",
                    City = "Hà Nội"
                },
                new Cinema
                {
                    CinemaId = 15,
                    Name = "CGV Big C Dĩ An",
                    Address = "Khu phố Đông Tân, P. Dĩ An, TP. Dĩ An, Bình Dương",
                    Hotline = "19001234",
                    City = "Bình Dương"
                },
                new Cinema
                {
                    CinemaId = 16,
                    Name = "CGV Hùng Vương Plaza",
                    Address = "126 Hùng Vương, Q.5, TP. HCM",
                    Hotline = "19001234",
                    City = "TP. HCM"
                }
            );


            modelBuilder.Entity<RoomType>()
                .HasData(
                    new RoomType
                    {
                        RoomTypeId = 1,
                        Name = "Large",
                        TotalSeat = 140
                    },
                    new RoomType
                    {
                        RoomTypeId = 2,
                        Name = "Small",
                        TotalSeat = 70
                    }
                );


            modelBuilder.Entity<SeatType>()
                .HasData(
                    new SeatType
                    {
                        SeatTypeId = 1,
                        Name = "Sweet Box",
                        Price = 125.000
                    },
                    new SeatType
                    {
                        SeatTypeId = 2,
                        Name = "VIP",
                        Price = 105.000
                    },
                    new SeatType
                    {
                        SeatTypeId = 3,
                        Name = "Normal",
                        Price = 100.000
                    },
                    new SeatType
                    {
                        SeatTypeId= 4,
                        Name ="GOLD CLASS",
                        Price = 300.000
                    }
                
                );


            modelBuilder.Entity<Combo>()
                .HasData(
                    new Combo
                    {
                        ComboId = 1,
                        Name = "Combo 1: Bắp + Nước",
                        Status = true,
                        ImageURL = "/images/combos/combo1.jpg",
                        Quantity = 100,
                        Price = 65.000,
                    },
                    new Combo
                    {
                        ComboId = 2,
                        Name = "Combo 2: 2 Bắp + 2 Nước",
                        Status = true,
                        ImageURL = "/images/combos/combo2.jpg",
                        Quantity = 80,
                        Price = 120.000
                    },
                    new Combo
                    {
                        ComboId = 3,
                        Name = "Combo Gia đình: 2 Bắp lớn + 3 Nước",
                        Status = true,
                        ImageURL = "/images/combos/combo_family.jpg",
                        Quantity = 50,
                        Price = 160.000
                    },
                    new Combo
                    {
                        ComboId = 4,
                        Name = "Combo Gà Rán + Nước",
                        Status = true,
                        ImageURL = "/images/combos/combo_chicken.jpg",
                        Quantity = 50,
                        Price = 90.000

                    },
                    new Combo
                    {
                        ComboId = 5,
                        Name = "Combo Sinh Nhật Đặc Biệt",
                        Status = true,
                        ImageURL = "/images/combos/combo_birthday.jpg",
                        Quantity = 20,
                        Price = 150.000
                    },
                     new Combo
                     {
                         ComboId = 6,
                         Name = "Combo Trẻ Em: Bắp nhỏ + Nước cam",
                         Status = true,
                         ImageURL = "/images/combos/combo_kid.jpg",
                         Quantity = 40,
                         Price = 55.000
                     },
                    new Combo
                    {
                        ComboId = 7,
                        Name = "Combo Couple: 1 Bắp lớn + 2 Nước",
                        Status = true,
                        ImageURL = "/images/combos/combo_couple.jpg",
                        Quantity = 60,
                        Price = 110.000
                    },
                    new Combo
                    {
                        ComboId = 8,
                        Name = "Combo Tiết Kiệm: Bắp vừa + Nước ngọt",
                        Status = true,
                        ImageURL = "/images/combos/combo_save.jpg",
                        Quantity = 100,
                        Price = 65.000
                    },
                    new Combo
                    {
                        ComboId = 9,
                        Name = "Combo Gà Nuggets + Pepsi",
                        Status = true,
                        ImageURL = "/images/combos/combo_nuggets.jpg",
                        Quantity = 30,
                        Price = 85.000
                    },
                    new Combo
                    {
                        ComboId = 10,
                        Name = "Combo Phô Mai: Bắp phô mai + 7Up",
                        Status = true,
                        ImageURL = "/images/combos/combo_cheese.jpg",
                        Quantity = 25,
                        Price = 70.000
                    },
                    new Combo
                    {
                        ComboId = 11,
                        Name = "Combo BBQ: Bắp vị BBQ + Coca",
                        Status = true,
                        ImageURL = "/images/combos/combo_bbq.jpg",
                        Quantity = 45,
                        Price = 70.000
                    },
                    new Combo
                    {
                        ComboId = 12,
                        Name = "Combo VIP: 2 Bắp + 2 Nước + Snack",
                        Status = true,
                        ImageURL = "/images/combos/combo_vip.jpg",
                        Quantity = 15,
                        Price = 135.000
                    },
                    new Combo
                    {
                        ComboId = 13,
                        Name = "Combo Valentine: Bắp tim + Trà Đào",
                        Status = true,
                        ImageURL = "/images/combos/combo_valentine.jpg",
                        Quantity = 70,
                        Price = 95.000
                    },
                    new Combo
                    {
                        ComboId = 14,
                        Name = "Combo Sinh viên: Bắp + Pepsi nhỏ",
                        Status = true,
                        ImageURL = "/images/combos/combo_student.jpg",
                        Quantity = 75,
                        Price = 50.000
                    },
                    new Combo
                    {
                        ComboId = 15,
                        Name = "Combo Chay: Bắp rang bơ + Nước suối",
                        Status = true,
                        ImageURL = "/images/combos/combo_vegan.jpg",
                        Quantity = 20,
                        Price = 60.000
                    }
                );








            modelBuilder.Entity<MovieActor>()
               .HasKey(ma => new { ma.MovieId, ma.ActorId });

            modelBuilder.Entity<ComboTicket>()
                .HasKey(cb => new { cb.TicketId, cb.ComboId });

            modelBuilder.Entity<CouponUser>()
                .HasKey(cu => new {cu.ClientId, cu.CouponId});

            modelBuilder.Entity<GenreMovie>()
                .HasKey(gv => new {gv.MovieId,gv.GenreId});

            modelBuilder.Entity<TicketSeat>()
                .HasKey(ts => new {ts.SeatId, ts.TicketId});

            modelBuilder.Entity<Rank>()
                .HasMany(r => r.Clients)
                .WithOne(c => c.Rank)
                .HasForeignKey(c => c.RankId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<GenreMovie>()
                .HasOne(gv => gv.Movie)
                .WithMany(m => m.GenreMovies)
                .HasForeignKey(gv => gv.MovieId);

            modelBuilder.Entity<GenreMovie>()
                .HasOne(gv => gv.Genre)
                .WithMany(g => g.GenreMovies)
                .HasForeignKey(gv => gv.GenreId);


            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Movie)
                .WithMany(m => m.Favorites)
                .HasForeignKey(f => f.MovieId)
                .OnDelete(DeleteBehavior.Cascade);
                

            modelBuilder.Entity<Favorite>()
                .HasOne(f => f.Client)
                .WithMany(c => c.Favorites)
                .HasForeignKey(f => f.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Reviews)
                .WithOne(r => r.Movie)
                .HasForeignKey(r => r.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Movie>()
                .HasMany(m => m.ShowingTimes)
                .WithOne(st => st.Movie)
                .HasForeignKey(st => st.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MovieActor>()
                .HasOne(ma => ma.Movie)
                .WithMany(m => m.MovieActors)
                .HasForeignKey(ma => ma.MovieId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<MovieActor>()
                .HasOne(ma => ma.Actor)
                .WithMany(a => a.MovieActors)
                .HasForeignKey(ma => ma.ActorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Client>()
                .HasMany(c => c.Reviews)
                .WithOne(r => r.Client)
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Client>()
                .HasMany(c => c.Tickets)
                .WithOne(t => t.Client)
                .HasForeignKey(t => t.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CouponUser>()
                .HasOne(co => co.Client)
                .WithMany(c => c.CouponUsers)
                .HasForeignKey(c => c.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<CouponUser>()
                .HasOne(co => co.Coupon)
                .WithMany(c => c.CouponUsers)
                .HasForeignKey(c => c.CouponId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.TicketSeats)
                .WithOne(ts => ts.Ticket)
                .HasForeignKey(ts => ts.TicketId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.ShowingTime)
                .WithMany(sw => sw.Tickets)
                .HasForeignKey(t => t.ShowingTimeId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Seat>()
                .HasOne(s => s.SeatType)
                .WithMany(st => st.Seats)
                .HasForeignKey(s => s.SeatTypeId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Seat>()
                .HasOne(s => s.Room)    
                .WithMany(r => r.Seats)
                .HasForeignKey(s => s.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomType)
                .WithMany(rt => rt.Rooms)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<Room>()
                .HasOne(r => r.Cinema)
                .WithMany(c => c.Rooms)
                .HasForeignKey(r => r.CinemaId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
                .HasMany(r => r.ShowingTimes)
                .WithOne(st => st.Room)
                .HasForeignKey(st => st.RoomId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Room>()
                .HasOne(r => r.RoomType)
                .WithMany(rt => rt.Rooms)
                .HasForeignKey(r => r.RoomTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Coupon)
                .WithMany(c => c.Tickets)
                .HasForeignKey(t => t.CouponId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Ticket>()
                .HasMany(t => t.ComboTickets)
                .WithOne(ct => ct.Ticket)
                .HasForeignKey(cb => cb.TicketId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Combo>()
                .HasMany(c => c.ComboTickets)
                .WithOne(ct => ct.Combo)
                .HasForeignKey(ct => ct.ComboId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Movie>()
                .HasMany(m => m.Tickets)
                .WithOne(t => t.Movie)
                .HasForeignKey(t => t.MovieId);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Actor> Actor { get; set; }

        public DbSet<Cinema> Cinema { get; set; }

        public DbSet<Client> Client { get; set; }

        public DbSet<Combo> Combo { get; set; }

        public DbSet<ComboTicket> ComboTicket { get; set; }

        public DbSet<TicketSeat> TicketSeat { get; set; }

        public DbSet<Coupon> Coupon { get; set; }

        public DbSet<CouponUser> CouponUser { get; set; }

        public DbSet<Genre> Genre { get; set; }

        public DbSet<Movie> Movie { get; set; }

        public DbSet<GenreMovie> GenreMovie { get; set; }

        public DbSet<MovieActor> MovieActor { get; set; }

        public DbSet<Rank> Rank { get; set; }

        public DbSet<Review> Review { get; set; }

        public DbSet<Room> Room { get; set; }

        public DbSet<RoomType> RoomType { get; set; }

        public DbSet<Seat> Seat { get; set; }

        public DbSet<SeatType> SeatType { get; set; }

        public DbSet<ShowingTime> ShowingTime { get; set; }

        public DbSet<Ticket> Ticket { get; set; }

        public DbSet<Favorite> Favorite { get; set; }

        public DbSet<PasswordResetCode> PasswordResetCode { get; set; }
    }
}
