using CinemaBookingApp.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace CinemaBookingApp.Data
{
    public static class SeedData
    {
      
        public static async Task SeedRoles(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();


            string[] roles = { "ADMIN", "CLIENT","STAFF" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        public static async Task SeedRooms(IServiceProvider serviceProvider)
        {
    
            using var scope = serviceProvider.CreateScope();
            var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

     
     
            var roomNames = new string[]{"Large", "Small", "Gold"};
            

            
            for(int i = 1; i <= 16; i++)
            {

                for (int j = 0;j<3;j++) {
                    Room newRoom = new Room
                    {
                        CinemaId = i,
                        Name = $"Room_{j+1}",
                     
                        RoomTypeId = j+1,
                    };
                     _context.Room.AddRange(newRoom);
                    await _context.SaveChangesAsync();
                    var seats = new List<Seat>();
                    if (roomNames[j] == "Large")
                    {
                        for(int row = 65; row <= 74; row++)
                        {
                            for (int column = 1; column <= 14; column++)
                            {
                                string tempRow = ((char)row).ToString();
                                seats.Add(new Seat
                                {
                                    Column = column,
                                    IsAvailable = true,
                                    RoomId = newRoom.RoomId,
                                    Row = tempRow,
                               
                                    SeatTypeId = row <= 68 ? 3 : row<= 72 ? 2 : 1,
                                    
                                });
                           
                            }
                        }
                    }
                    else if (roomNames[j] == "Small")
                    {
                        for (int row = 67; row <= 72; row++)
                        {
                            for (int column = 1; column <= 14; column++)
                            {
                                string tempRow = ((char)row).ToString();
                                seats.Add(new Seat
                                {
                                    Column = column,
                                    IsAvailable = true,
                                    RoomId = newRoom.RoomId,
                                    Row = tempRow,
                                
                                    SeatTypeId = row <= 70 ? 3 : 2,

                                });
                            
                            }
                        }
                    }
                    else
                    {
                        for (int row = 66; row <= 74; row+=2)
                        {
                            var coloums = new int[] { 2,3,5,6,9,10,12,13};
                            for (int column = 0; column < coloums.Length; column+=2)
                            {
                                string tempRow = ((char)row).ToString();
                                seats.Add(new Seat
                                {
                                    Column = coloums[column],
                                    IsAvailable = true,
                                    RoomId = newRoom.RoomId,
                                    Row = tempRow,
                                  
                                    SeatTypeId = 4

                                });
                              
                                seats.Add(new Seat
                                     {
                                         Column = coloums[column+1],
                                         IsAvailable = true,
                                         RoomId = newRoom.RoomId,
                                         Row = tempRow,
                                       
                                         SeatTypeId = 4

                                     });
                            
                            }
                        }
                    }
                     _context.Seat.AddRange(seats);
                    
                    await _context.SaveChangesAsync();
                }
               
            }
        }

        public static async Task SeedShowingTimes(IServiceProvider serviceProvider)
        {

            using var scope = serviceProvider.CreateScope();
            var _context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var showingTimes = new List<ShowingTime> {

    new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 8, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 10, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 13, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 15, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 17, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 20, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 22, 15, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 11, 23, 45, 0) },

        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 9, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 11, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 13, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 15, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 17, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 19, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 21, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 12, 23, 0, 0) },

        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 8, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 10, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 12, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 14, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 16, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 18, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 20, 30, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 13, 22, 30, 0) },

        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 9, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 11, 15, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 13, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 15, 15, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 17, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 19, 15, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 21, 45, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 14, 23, 15, 0) },

        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 8, 0, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 10, 20, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 12, 40, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 14, 50, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 17, 10, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 19, 25, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 21, 35, 0) },
        new ShowingTime{ StartTime = new DateTime(2025, 6, 15, 23, 50, 0) }
};

            var movieIds = new long[] { 10008, 10009, 10006, 10007};

            var roomIds = new long[] { 103,104,105 };

            var AddShowingTimes = new List<ShowingTime>();

            int indexMovieId = 0;
            int indexRoomId = 0;

  
            for (int i = 0; i < showingTimes.Count; i++)
            {
                AddShowingTimes.Add(new ShowingTime
                {
                    MovieId = movieIds[indexMovieId],
                    RoomId = roomIds[indexRoomId],
                    StartTime = showingTimes[i].StartTime,
                });


                indexMovieId = (indexMovieId + 1) % movieIds.Length;
                indexRoomId = (indexRoomId + 1) % roomIds.Length;
            }

            _context.ShowingTime.AddRange(AddShowingTimes);
            await _context.SaveChangesAsync();
        }


        //public static async Task SeedAdmin(IServiceProvider serviceProvider)
        //{
        //    //string adminEmail = "admin@admin";
        //    //string password = "admin";

            //    //if (await userManager.FindByEmailAsync(adminEmail) == null)
            //    //{
            //    //    var user = new IdentityUser
            //    //    {
            //    //        UserName = adminEmail,
            //    //        Email = adminEmail,
            //    //        EmailConfirmed = true
            //    //    };



            //    //    var result = await userManager.CreateAsync(user, password);
            //    //    if (result.Succeeded)
            //    //    {
            //    //        await userManager.AddToRoleAsync(user, "Admin");
            //    //        var admin = new Admin
            //    //        {
            //    //            Gender = true,
            //    //            Address = "Ấp A",
            //    //            DateOfBirth = DateTime.Now,
            //    //            IsActive = true,
            //    //            Name = "TanCoi",
            //    //            PhoneNumber = "0783481811",
            //    //            User = user,
            //    //            UserId = user.Id
            //    //        };
            //    //        var cosmeticContext = serviceProvider.GetRequiredService<CosmeticContext>();
            //    //        cosmeticContext.Admin.Add(admin);
            //    //        await cosmeticContext.SaveChangesAsync();
            //    //    }
            //    //}
            //}
    }
}
