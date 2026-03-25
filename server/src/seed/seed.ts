import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Genre } from '../models/Genre.model.js';
import { Person } from '../models/Person.model.js';
import { Cinema } from '../models/Cinema.model.js';
import { CinemaRoom } from '../models/CinemaRoom.model.js';
import { Movie } from '../models/Movie.model.js';
import { Showtime } from '../models/Showtime.model.js';
import { slugify } from '../utils/slugify.js';
import { SHOWTIME_STATUS } from '@shared/constants/statuses.js';
import { ROOM_TYPE } from '@shared/constants/seat-types.js';
import path from 'path';

import { setServers } from 'node:dns/promises';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
setServers(['1.1.1.1', '8.8.8.8']); // Sửa lỗi DNS của Node trên máy Windows

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/micinema';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected for Seeding');
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

const createSeats = (rows: number, cols: number) => {
  const seats = [];
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < rows; i++) {
    for (let j = 1; j <= cols; j++) {
      seats.push({
        seatId: `${rowLabels[i]}${j}`,
        row: rowLabels[i],
        col: j,
        type: 'NORMAL',
        isActive: true,
      });
    }
  }
  return seats;
};

const seed = async () => {
  await connectDB();

  console.log('1. Xoá dữ liệu phim cũ...');
  await Promise.all([
    Genre.deleteMany({}),
    Person.deleteMany({}),
    Cinema.deleteMany({}),
    CinemaRoom.deleteMany({}),
    Movie.deleteMany({}),
    Showtime.deleteMany({}),
  ]);

  // Drop indexes to prevent text index language errors
  try {
    await Movie.collection.dropIndexes();
  } catch (e) {
    // ignore if not exists
  }

  console.log('2. Tạo Thể Loại...');
  const genres = await Genre.insertMany([
    { name: 'Hành Động', slug: slugify('Hành Động') },
    { name: 'Khoa Học Viễn Tưởng', slug: slugify('Khoa Học Viễn Tưởng') },
    { name: 'Kinh Dị', slug: slugify('Kinh Dị') },
    { name: 'Hài Hước', slug: slugify('Hài Hước') },
    { name: 'Tình Cảm', slug: slugify('Tình Cảm') },
  ]);

  console.log('3. Tạo Nhân Sự (Đạo diễn & Diễn viên)...');
  const persons = await Person.insertMany([
    {
      name: 'Christopher Nolan',
      slug: slugify('Christopher Nolan'),
      role: 'DIRECTOR',
      avatar: 'https://image.tmdb.org/t/p/w200/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg',
    },
    {
      name: 'Ryan Gosling',
      slug: slugify('Ryan Gosling'),
      role: 'ACTOR',
      avatar: 'https://image.tmdb.org/t/p/w200/lyUyVARQEhIGcmcVyZTXobrpvhi.jpg',
    },
    {
      name: 'Emma Stone',
      slug: slugify('Emma Stone'),
      role: 'ACTOR',
      avatar: 'https://image.tmdb.org/t/p/w200/2hwHwA1mNHrI6Ibsk70kKkX860I.jpg',
    },
    {
      name: 'Denis Villeneuve',
      slug: slugify('Denis Villeneuve'),
      role: 'DIRECTOR',
      avatar: 'https://image.tmdb.org/t/p/w200/rsx0CttmGgONb770X01V8fL8f9X.jpg',
    },
    {
      name: 'Timothée Chalamet',
      slug: slugify('Timothée Chalamet'),
      role: 'ACTOR',
      avatar: 'https://image.tmdb.org/t/p/w200/B2DpwjIfVn9X7j7pPib81Zg3wS.jpg',
    },
  ]);

  console.log('4. Tạo Chi Nhánh Rạp (Cinema)...');
  const cinemas = await Cinema.insertMany([
    {
      name: 'Galaxy CineX - Hà Nội Centre',
      slug: slugify('Galaxy CineX - Hà Nội Centre'),
      address: '123 Cầu Giấy, Hà Nội',
      city: 'Hà Nội',
      images: [
        'https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg',
      ],
    },
    {
      name: 'Galaxy CineX - Đắk Lắk',
      slug: slugify('Galaxy CineX - Đắk Lắk'),
      address: '71 Nguyễn Tất Thành, Buôn Ma Thuột',
      city: 'Đắk Lắk',
      images: [
        'https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg',
      ],
    },
    {
      name: 'Galaxy CineX - TP.HCM Quận 1',
      slug: slugify('Galaxy CineX - TP.HCM Quận 1'),
      address: 'Đồng Khởi, Quận 1, Tp.HCM',
      city: 'TP Hồ Chí Minh',
      images: [
        'https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg',
      ],
    },
  ]);

  console.log('5. Tạo Phòng Chiếu (CinemaRoom)...');
  const rooms = [];
  for (const cinema of cinemas) {
    rooms.push({
      name: `Phòng 1 (Standard) - ${cinema.name}`,
      cinemaId: cinema._id,
      roomType: ROOM_TYPE.STANDARD,
      rows: 10,
      cols: 10,
      seats: createSeats(10, 10),
    });
    rooms.push({
      name: `Phòng 2 (IMAX) - ${cinema.name}`,
      cinemaId: cinema._id,
      roomType: ROOM_TYPE.IMAX,
      rows: 15,
      cols: 12,
      seats: createSeats(15, 12),
    });
  }
  const insertedRooms = await CinemaRoom.insertMany(rooms);

  console.log('6. Tạo Phim (Movies)...');
  const movies = await Movie.insertMany([
    {
      title: 'Thoát Khỏi Tận Thế (Dự Án Hail Mary)',
      slug: slugify('Thoát Khỏi Tận Thế (Dự Án Hail Mary)'),
      description:
        'Ryland Grace là một giáo viên khoa học nhận ra anh chính là hy vọng cuối cùng của Trái Đất...\nGiữa không gian vũ trụ cô độc, anh phải gánh vác sứ mệnh quan trọng.',
      directors: [persons[0]._id],
      actors: [persons[1]._id, persons[2]._id],
      genres: [genres[0]._id, genres[1]._id],
      duration: 157,
      releaseDate: new Date(),
      poster:
        'https://iguov8nhvyobj.vcdn.cloud/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/3/5/350x495-mary.jpg',
      trailer: 'https://www.youtube.com/watch?v=1g3_CFmnU7k',
      rating: 8.8,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'SUBTITLED',
      ageRating: 'C13',
      country: 'Mỹ',
      viewCount: 1543,
    },
    {
      title: 'Dune: Hành Tinh Cát - Phần 2',
      slug: slugify('Dune: Hành Tinh Cát - Phần 2'),
      description: 'Hành trình trả thù của Paul Atreides chống lại hoàng đế.',
      directors: [persons[3]._id],
      actors: [persons[4]._id],
      genres: [genres[0]._id, genres[1]._id],
      duration: 166,
      releaseDate: new Date(),
      poster:
        'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/022024/18_1_20240229171501.jpg',
      trailer: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      rating: 9.1,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'DUBBED',
      ageRating: 'P',
      country: 'Mỹ',
      viewCount: 5200,
    },
    {
      title: 'Dự Án Ma Sói (Upcoming)',
      slug: slugify('Dự Án Ma Sói (Upcoming)'),
      description: 'Một bộ phim kinh dị sinh tồn vào đầu năm 2027.',
      directors: [persons[3]._id],
      actors: [persons[2]._id],
      genres: [genres[2]._id],
      duration: 110,
      releaseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 ngày sau
      poster:
        'https://img-cdn.2game.vn/pictures/images/2015/10/14/Ma_soi_3.jpg',
      trailer: 'https://www.youtube.com/watch?v=u31qwQUeGuM',
      rating: 0,
      status: 'UPCOMING',
      language: 'Tiếng Nhật',
      audioType: 'SUBTITLED',
      ageRating: 'C18',
      country: 'Nhật Bản',
      viewCount: 120,
    },
  ]);

  console.log('7. Tạo Suất Chiếu (Showtimes) cho 3 ngày tới...');
  const showtimes = [];
  const today = new Date();
  today.setHours(today.getHours() + 1); // 1 tiếng tiếp theo
  today.setMinutes(0, 0, 0);

  // Tạo lịch cho từng phim (chỉ những phim RELEASED), từng rạp, từng phòng
  const showingMovies = movies.filter((m) => m.status === 'RELEASED');

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    for (const cinema of cinemas) {
      // Lấy danh sách phòng của rạp này
      const cinemaRooms = insertedRooms.filter(
        (r) => r.cinemaId.toString() === cinema._id.toString(),
      );

      for (const movie of showingMovies) {
        for (const room of cinemaRooms) {
          // Mỗi phòng chiếu 2 suất 1 ngày cho phim này
          for (let slot = 0; slot < 2; slot++) {
            const st = new Date(today);
            st.setDate(st.getDate() + dayOffset);
            st.setHours(10 + slot * 4); // 10h sáng và 14h chiều

            showtimes.push({
              movieId: movie._id,
              cinemaId: cinema._id,
              roomId: room._id,
              startTime: st,
              ticketPrice: room.roomType === ROOM_TYPE.IMAX ? 120000 : 80000,
              status: SHOWTIME_STATUS.OPEN,
            });
          }
        }
      }
    }
  }

  await Showtime.insertMany(showtimes);

  console.log('✅ Seed xong dữ liệu Phim, Rạp, Suất Chiếu. Thoát...');
  process.exit();
};

seed();
