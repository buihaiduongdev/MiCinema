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
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/micinema';
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
    { name: 'Christopher Nolan', slug: slugify('Christopher Nolan'), roles: ['DIRECTOR'], avatar: 'https://image.tmdb.org/t/p/w200/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' },
    { name: 'Ryan Gosling', slug: slugify('Ryan Gosling'), roles: ['ACTOR'], avatar: 'https://image.tmdb.org/t/p/w200/lyUyVARQEhIGcmcVyZTXobrpvhi.jpg' },
    { name: 'Emma Stone', slug: slugify('Emma Stone'), roles: ['ACTOR'], avatar: 'https://image.tmdb.org/t/p/w200/2hwHwA1mNHrI6Ibsk70kKkX860I.jpg' },
    { name: 'Denis Villeneuve', slug: slugify('Denis Villeneuve'), roles: ['DIRECTOR'], avatar: 'https://image.tmdb.org/t/p/w200/rsx0CttmGgONb770X01V8fL8f9X.jpg' },
    { name: 'Timothée Chalamet', slug: slugify('Timothée Chalamet'), roles: ['ACTOR'], avatar: 'https://image.tmdb.org/t/p/w200/B2DpwjIfVn9X7j7pPib81Zg3wS.jpg' },
    {
      name: 'Chris Evans', slug: slugify('Chris Evans'), roles: ['ACTOR'],
      avatar: 'https://m.media-amazon.com/images/M/MV5BNzQ0YWM1ODEtZDFkYy00MGJhLTkwZDUtMzVkZjljODU3ZTRmXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      nationality: 'Mỹ', height: 183, viewCount: 154634, birthDate: new Date('1981-06-13'),
      images: [
        'https://upload.wikimedia.org/wikipedia/commons/2/25/Chris_Evans_SDCC_2014.jpg',
        'https://www.caa.com/caaspeakers/partyHeadshot/chris-evans.png',
        'https://c8.alamy.com/comp/2F0RX2B/chris-evans-22-april-2007-hollywood-california-movielines-hollywood-life-9th-annual-young-hollywood-awards-arrivals-photo-credit-giulio-marcocchisipa-press-copyright-2007-by-giulio-marcocchiyoung-gm2550704230949-2F0RX2B.jpg'
      ],
      biography: 'Khác với Chris Hemsworth vẫn đang loay hoay trong hình tượng vị thần sấm sét, đa số người hâm mộ vẫn nhìn nhận rõ ràng. Chris Evans và Captain America là hai con người hoàn toàn khác nhau.\n\nSinh ngày 13 tháng 6 năm 1981 tại Boston, bang Massachusetts, con đường diễn xuất của cậu bé Chris Evans bắt đầu từ nhỏ với những vở kịch trong trường học. Tình yêu diễn xuất lớn dần theo năm tháng, khi trưởng thành, Evans lắng nghe tiếng gọi con tim, tới New York và thi vào trường nghệ thuật Lee Strasberg.'
    },
    {
      name: 'Margot Robbie', slug: slugify('Margot Robbie'), roles: ['ACTOR'],
      avatar: 'https://image.tmdb.org/t/p/w200/p5iFqTqA71F6rA1v2W8i7U3X6v8.jpg',
      nationality: 'Úc', height: 168, viewCount: 129409, birthDate: new Date('1990-07-02'),
      biography: 'Dĩ nhiên, có nhan sắc chẳng bao giờ là đủ để đảm bảo cho chiếc vé thành công tại Hollywood. Margot còn phải cố gắng nhiều. Nhưng ta biết, hiện nay nàng xứng đáng được coi là minh tinh hạng A!'
    },
    {
      name: 'Charlize Theron', slug: slugify('Charlize Theron'), roles: ['ACTOR'],
      avatar: 'https://image.tmdb.org/t/p/w200/vQvS1yGqB7M0f4hN1gG1f0P1hV3.jpg',
      nationality: 'Nam Phi', height: 177, viewCount: 104261, birthDate: new Date('1975-08-07'),
      biography: 'Bắt đầu từ vai diễn không có lời thoại, chỉ xuất hiện 3 giây trong một bộ phim hạng B, Charlize Theron nay đã trở thành nữ thần của Hollywood.'
    },
    {
      name: 'Robert Downey Jr.', slug: slugify('Robert Downey Jr.'), roles: ['ACTOR'],
      avatar: 'https://image.tmdb.org/t/p/w200/1YjdSym1jTG7xjHSI0yGGWEswGL.jpg',
      nationality: 'Mỹ', height: 174, viewCount: 99250, birthDate: new Date('1965-04-04'),
      biography: 'Thành công lớn ở giai đoạn đầu sự nghiệp nhưng nghiện ngập từ bé, có phim kiếm cả tỉ đôla lại từng lang thang không xu dính túi, 2 lần để cử Oscar đi kèm với những lần vào tù ra khám... Nếu phải chọn cuộc đời một ngôi sao để viết kịch bản phim, thì "cuộc đời của Robert Downey Jr. là hoàn hảo nhất!"'
    }
  ]);

  console.log('4. Tạo Chi Nhánh Rạp (Cinema)...');
  const cinemas = await Cinema.insertMany([
    {
      name: 'Galaxy CineX - Hà Nội Centre',
      slug: slugify('Galaxy CineX - Hà Nội Centre'),
      address: '123 Cầu Giấy, Hà Nội',
      city: 'Hà Nội',
      images: ['https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg'],
    },
    {
      name: 'Galaxy CineX - Đắk Lắk',
      slug: slugify('Galaxy CineX - Đắk Lắk'),
      address: '71 Nguyễn Tất Thành, Buôn Ma Thuột',
      city: 'Đắk Lắk',
      images: ['https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg'],
    },
    {
      name: 'Galaxy CineX - TP.HCM Quận 1',
      slug: slugify('Galaxy CineX - TP.HCM Quận 1'),
      address: 'Đồng Khởi, Quận 1, Tp.HCM',
      city: 'TP Hồ Chí Minh',
      images: ['https://bmd.com.vn/wp-content/uploads/2022/11/ghe-rap-chieu-phim-4.jpeg'],
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
      title: 'CAPTAIN AMERICA: CHIẾN BINH MÙA ĐÔNG',
      slug: slugify('CAPTAIN AMERICA: CHIẾN BINH MÙA ĐÔNG'),
      description: 'Hành trình chống lại Hydra của Steve Rogers.',
      directors: [persons[0]._id],
      actors: [persons[5]._id],
      genres: [genres[0]._id, genres[1]._id],
      duration: 136,
      releaseDate: new Date('2014-04-04'),
      poster: 'https://upload.wikimedia.org/wikipedia/vi/e/e8/Captain_America_The_Winter_Soldier.jpg',
      rating: 7.8,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'SUBTITLED',
      ageRating: 'C13',
      country: 'Mỹ',
      viewCount: 15430,
    },
    {
      title: 'CAPTAIN AMERICA: NỘI CHIẾN SIÊU ANH HÙNG',
      slug: slugify('CAPTAIN AMERICA: NỘI CHIẾN SIÊU ANH HÙNG'),
      description: 'Trận chiến chia rẽ Avengers.',
      directors: [persons[0]._id],
      actors: [persons[5]._id, persons[8]._id],
      genres: [genres[0]._id, genres[1]._id],
      duration: 147,
      releaseDate: new Date('2016-05-06'),
      poster: 'https://static1.dienanh.net/upload/202206/d2339787-05a0-41b5-8f17-7240cd7d94f7.jpg',
      rating: 7.8,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'DUBBED',
      ageRating: 'P',
      country: 'Mỹ',
      viewCount: 22100,
    },
    {
      title: 'Knives Out',
      slug: slugify('Knives Out'),
      description: 'Vụ án bí ẩn gia đình Thrombrey.',
      directors: [persons[0]._id],
      actors: [persons[5]._id],
      genres: [genres[2]._id, genres[3]._id],
      duration: 130,
      releaseDate: new Date('2019-11-27'),
      poster: 'https://image.tmdb.org/t/p/w500/pThyQovXQrw2m0s9x82twj48Jq4.jpg',
      trailer: 'https://www.youtube.com/watch?v=sL-9Khv7wa4',
      rating: 8.0,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'SUBTITLED',
      ageRating: 'C16',
      country: 'Mỹ',
      viewCount: 10400,
    },
    {
      title: 'AVENGERS: INFINITY WAR',
      slug: slugify('AVENGERS: INFINITY WAR'),
      description: 'Cuộc chiến vô cực chấn động thế giới.',
      directors: [persons[0]._id],
      actors: [persons[5]._id, persons[8]._id],
      genres: [genres[0]._id, genres[1]._id],
      duration: 149,
      releaseDate: new Date('2018-04-27'),
      poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
      rating: 8.5,
      status: 'RELEASED',
      language: 'Tiếng Anh',
      audioType: 'SUBTITLED',
      ageRating: 'C13',
      country: 'Mỹ',
      viewCount: 45000,
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
      poster: 'https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/022024/18_1_20240229171501.jpg',
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
      poster: 'https://img-cdn.2game.vn/pictures/images/2015/10/14/Ma_soi_3.jpg',
      trailer: 'https://www.youtube.com/watch?v=u31qwQUeGuM',
      rating: 0,
      status: 'UPCOMING',
      language: 'Tiếng Nhật',
      audioType: 'SUBTITLED',
      ageRating: 'C18',
      country: 'Nhật Bản',
      viewCount: 120,
    }
  ]);

  console.log('7. Tạo Suất Chiếu (Showtimes) cho 3 ngày tới...');
  const showtimes = [];
  const today = new Date();
  today.setHours(today.getHours() + 1); // 1 tiếng tiếp theo
  today.setMinutes(0, 0, 0);

  // Tạo lịch cho từng phim (chỉ những phim RELEASED), từng rạp, từng phòng
  const showingMovies = movies.filter(m => m.status === 'RELEASED');

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {
    for (const cinema of cinemas) {
      // Lấy danh sách phòng của rạp này
      const cinemaRooms = insertedRooms.filter(r => r.cinemaId.toString() === cinema._id.toString());

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
