import mongoose from 'mongoose';
import { CinemaRoom } from '../models/CinemaRoom.model';
import { Movie } from '../models/Movie.model';
import { Showtime } from '../models/Showtime.model';
import { Product } from '../models/Product.model';
import { User } from '../models/User.model';
import { env } from '../config/env';

const generateSeats = (rows: number, cols: number) => {
  const seats = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRST';

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      let type: 'NORMAL' | 'VIP' | 'SWEETBOX' = 'NORMAL';
      
      if (r >= 3 && r <= 5) type = 'VIP';
      if (r === rows - 1 && c % 3 === 0) type = 'SWEETBOX';

      seats.push({
        row: rowLabels[r],
        col: c,
        type,
        isActive: true,
      });
    }
  }

  return seats;
};

async function seedData() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await CinemaRoom.deleteMany({});
    await Movie.deleteMany({});
    await Showtime.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});

    const room1 = await CinemaRoom.create({
      name: 'Phòng 1',
      rows: 9,
      colsPerRow: 12,
      type: 'STANDARD',
      isActive: true,
      seats: generateSeats(9, 12),
    });

    const room2 = await CinemaRoom.create({
      name: 'Phòng VIP',
      rows: 8,
      colsPerRow: 10,
      type: 'VIP',
      isActive: true,
      seats: generateSeats(8, 10),
    });

    console.log('✅ Created rooms:', room1.name, room2.name);

    const movie1 = await Movie.create({
      title: 'Avengers: Endgame',
      duration: 180,
      genre: ['Action', 'Sci-Fi'],
      director: 'Russo Brothers',
      cast: ['Robert Downey Jr.', 'Chris Evans'],
      releaseDate: new Date('2024-04-26'),
      poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      rating: 8.4,
      status: 'RELEASED',
      isActive: true,
    });

    const movie2 = await Movie.create({
      title: 'Spider-Man: No Way Home',
      duration: 148,
      genre: ['Action', 'Adventure'],
      director: 'Jon Watts',
      cast: ['Tom Holland', 'Zendaya'],
      releaseDate: new Date('2024-12-15'),
      poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
      rating: 8.2,
      status: 'RELEASED',
      isActive: true,
    });

    console.log('✅ Created movies:', movie1.title, movie2.title);

    const today = new Date();
    today.setHours(19, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const showtime1 = await Showtime.create({
      movieId: movie1._id,
      roomId: room1._id,
      startTime: today,
      ticketPrice: 80000,
      status: 'OPEN',
      seatStatus: room1.seats.map((seat) => ({
        seatId: `${seat.row}${seat.col}`,
        status: 'AVAILABLE',
      })),
    });

    const showtime2 = await Showtime.create({
      movieId: movie2._id,
      roomId: room2._id,
      startTime: tomorrow,
      ticketPrice: 100000,
      status: 'OPEN',
      seatStatus: room2.seats.map((seat) => ({
        seatId: `${seat.row}${seat.col}`,
        status: 'AVAILABLE',
      })),
    });

    console.log('✅ Created showtimes:', showtime1._id, showtime2._id);

    const products = await Product.insertMany([
      {
        name: 'Bắp rang bơ lớn',
        price: 60000,
        category: 'FOOD',
        description: 'Bắp rang bơ thơm ngon',
        isActive: true,
      },
      {
        name: 'Coca Cola',
        price: 25000,
        category: 'DRINK',
        description: 'Coca Cola 500ml',
        isActive: true,
      },
      {
        name: 'Pepsi',
        price: 25000,
        category: 'DRINK',
        description: 'Pepsi 500ml',
        isActive: true,
      },
      {
        name: 'Combo Couple',
        price: 99000,
        category: 'COMBO',
        description: '1 Bắp lớn + 2 Nước ngọt',
        isActive: true,
        comboItems: [],
      },
      {
        name: 'Combo Family',
        price: 150000,
        category: 'COMBO',
        description: '2 Bắp lớn + 4 Nước ngọt',
        isActive: true,
        comboItems: [],
      },
    ]);

    console.log('✅ Created products:', products.length, 'items');

    console.log('\n🎉 SEED DATA COMPLETED!\n');
    console.log('📝 Test URLs:');
    console.log(`- Booking (Avengers): http://localhost:5173/booking/${showtime1._id}`);
    console.log(`- Booking (Spider-Man): http://localhost:5173/booking/${showtime2._id}`);
    console.log(`- Admin Rooms: http://localhost:5173/admin/rooms`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedData();
