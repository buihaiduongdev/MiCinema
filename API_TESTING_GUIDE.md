# API Testing Guide - UC-34, UC-35, UC-36

## 🧪 Test Cases & Examples

### UC-34: Revenue Statistics

#### Test 1: Daily Revenue for Last 30 Days
```bash
curl -X GET "http://localhost:5000/api/statistics/revenue?startDate=2026-02-23&endDate=2026-03-25&groupBy=day" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "groupBy": "day",
    "data": [
      {
        "_id": "2026-02-23",
        "revenue": 3500000,
        "bookings": 100
      },
      {
        "_id": "2026-02-24",
        "revenue": 4200000,
        "bookings": 120
      }
    ],
    "summary": {
      "totalRevenue": 105000000,
      "totalBookings": 3000,
      "averageRevenuePerBooking": 35000
    }
  }
}
```

#### Test 2: Weekly Revenue
```bash
curl -X GET "http://localhost:5000/api/statistics/revenue?groupBy=week" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 3: Monthly Revenue
```bash
curl -X GET "http://localhost:5000/api/statistics/revenue?groupBy=month" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### UC-35: Occupancy Rate Statistics

#### Test 1: Overall Room Occupancy
```bash
curl -X GET "http://localhost:5000/api/statistics/occupancy/by-room" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overallOccupancyRate": 78.5,
    "byRoom": [
      {
        "roomId": "507f1f77bcf86cd799439011",
        "roomName": "Phòng 1",
        "roomType": "STANDARD",
        "rows": 10,
        "cols": 10,
        "totalSeats": 100,
        "bookedSeats": 85,
        "availableSeats": 15,
        "occupancyRate": 85.0
      },
      {
        "roomId": "507f1f77bcf86cd799439012",
        "roomName": "Phòng 2",
        "roomType": "VIP",
        "rows": 8,
        "cols": 8,
        "totalSeats": 64,
        "bookedSeats": 45,
        "availableSeats": 19,
        "occupancyRate": 70.3
      }
    ]
  }
}
```

#### Test 2: Occupancy for Specific Room
```bash
curl -X GET "http://localhost:5000/api/statistics/occupancy?roomId=507f1f77bcf86cd799439011" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 3: Occupancy for Specific Showtime
```bash
curl -X GET "http://localhost:5000/api/statistics/occupancy?showtimeId=507f1f77bcf86cd799439020" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### UC-36: Top Movies by Revenue

#### Test 1: Top 10 Movies by Revenue
```bash
curl -X GET "http://localhost:5000/api/statistics/top-movies?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "_id": "507f1f77bcf86cd799439030",
      "movieId": "507f1f77bcf86cd799439030",
      "movieTitle": "Avengers: Endgame",
      "moviePoster": "https://example.com/posters/avengers.jpg",
      "totalBookings": 450,
      "totalRevenue": 22500000,
      "averageTicketPrice": 50000,
      "totalTicketsSold": 450
    },
    {
      "rank": 2,
      "_id": "507f1f77bcf86cd799439031",
      "movieId": "507f1f77bcf86cd799439031",
      "movieTitle": "Avatar",
      "moviePoster": "https://example.com/posters/avatar.jpg",
      "totalBookings": 380,
      "totalRevenue": 19000000,
      "averageTicketPrice": 50000,
      "totalTicketsSold": 380
    }
  ]
}
```

#### Test 2: Top 5 Movies
```bash
curl -X GET "http://localhost:5000/api/statistics/top-movies?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Test 3: Detailed Movie Statistics (Revenue + Bookings)
```bash
curl -X GET "http://localhost:5000/api/statistics/movies/detailed?limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "topByRevenue": [
      {
        "movieId": "507f1f77bcf86cd799439030",
        "movieTitle": "Avengers: Endgame",
        "moviePoster": "https://example.com/posters/avengers.jpg",
        "status": "RELEASED",
        "totalBookings": 450,
        "totalRevenue": 22500000,
        "averageTicketPrice": 50000,
        "totalTicketsSold": 450,
        "showtimesCount": 25
      }
    ],
    "topByBookings": [
      {
        "movieId": "507f1f77bcf86cd799439031",
        "movieTitle": "Avatar",
        "moviePoster": "https://example.com/posters/avatar.jpg",
        "status": "RELEASED",
        "totalBookings": 500,
        "totalRevenue": 20000000,
        "averageTicketPrice": 40000,
        "totalTicketsSold": 500,
        "showtimesCount": 30
      }
    ]
  }
}
```

---

## 🔍 Verification Checklist

### UC-34: Revenue Statistics
- [ ] Can fetch revenue without date range (all-time)
- [ ] Can fetch revenue with start date only
- [ ] Can fetch revenue with end date only
- [ ] Can fetch revenue with both dates
- [ ] Daily grouping returns correct format
- [ ] Weekly grouping returns correct format
- [ ] Monthly grouping returns correct format
- [ ] Summary includes totalRevenue
- [ ] Summary includes totalBookings
- [ ] Summary includes averageRevenuePerBooking
- [ ] Only PAID bookings are counted
- [ ] Data is sorted by date ascending

### UC-35: Occupancy Rate
- [ ] Can fetch occupancy by room aggregate
- [ ] Overall occupancy rate is calculated
- [ ] Room-level occupancy rates are correct
- [ ] Can filter by specific room
- [ ] Can filter by specific showtime
- [ ] Occupied seats + available = total seats
- [ ] Occupancy percentage is accurate
- [ ] Cancelled bookings are excluded
- [ ] Room names are included
- [ ] Room types are included

### UC-36: Top Movies
- [ ] Top movies ranked by revenue descending
- [ ] Rank numbers start from 1
- [ ] Movie titles are included
- [ ] Movie posters are included
- [ ] Revenue calculation is correct
- [ ] Booking count is accurate
- [ ] Average ticket price calculated correctly
- [ ] Detailed stats include both revenue and booking rankings
- [ ] Showtime count is included
- [ ] Movie status is included

---

## 📊 Sample Data for Testing

### Revenue Distribution (Last 30 Days)
- Total Revenue: 105,000,000 VND
- Total Bookings: 3,000
- Average per Booking: 35,000 VND

### Room Configuration
- Phòng 1 (STANDARD): 10x10 = 100 seats, 85% occupied
- Phòng 2 (VIP): 8x8 = 64 seats, 70% occupied
- Phòng 3 (PREMIUM): 12x10 = 120 seats, 82% occupied

### Top 3 Movies
1. Avengers: Endgame - 22,500,000 VND (450 bookings)
2. Avatar - 19,000,000 VND (380 bookings)
3. Avatar: The Way of Water - 18,500,000 VND (370 bookings)

---

## 🐛 Troubleshooting

### Issue: Authorization Error (401)
**Solution:** Ensure JWT token is included in Authorization header
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Issue: Invalid Date Format
**Solution:** Use ISO 8601 format (YYYY-MM-DD)
```bash
# ✅ Correct
startDate=2026-03-01

# ❌ Incorrect
startDate=03/01/2026
```

### Issue: Empty Response Data
**Solution:** Check if data exists in database for the period
```bash
# Try without date filters first
GET /api/statistics/revenue

# Then narrow down with dates
GET /api/statistics/revenue?startDate=2026-03-01&endDate=2026-03-25
```

### Issue: Invalid groupBy Parameter
**Solution:** Only use: 'day', 'week', or 'month'
```bash
# ✅ Correct
groupBy=day
groupBy=week
groupBy=month

# ❌ Incorrect
groupBy=daily
groupBy=weekly
groupBy=yearly
```

---

## 📈 Performance Considerations

- Revenue queries with large date ranges may take 2-3 seconds
- Occupancy by room queries are cached-friendly
- Top movies queries use aggregation pipeline (optimized)
- Recommend caching results for 30 seconds to 1 minute
- For charts, pre-aggregate data on client side when possible

---

## 🚀 Frontend Integration Examples

### React Component - Revenue Chart
```jsx
const RevenueChart = () => {
  const [revenue, setRevenue] = useState(null);
  
  useEffect(() => {
    apiClient.get('/statistics/revenue', {
      params: {
        groupBy: 'day',
        startDate: '2026-02-23',
        endDate: '2026-03-25'
      }
    }).then(res => setRevenue(res.data.data));
  }, []);

  return <LineChart data={revenue?.data} />;
};
```

### React Component - Occupancy Rate
```jsx
const OccupancyStats = () => {
  const [occupancy, setOccupancy] = useState(null);
  
  useEffect(() => {
    apiClient.get('/statistics/occupancy/by-room')
      .then(res => setOccupancy(res.data.data));
  }, []);

  return (
    <div>
      <h2>Overall Occupancy: {occupancy?.overallOccupancyRate}%</h2>
      <RoomOccupancyList rooms={occupancy?.byRoom} />
    </div>
  );
};
```

### React Component - Top Movies
```jsx
const TopMovies = () => {
  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    apiClient.get('/statistics/top-movies', {
      params: { limit: 10 }
    }).then(res => setMovies(res.data.data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Movie</th>
          <th>Revenue</th>
          <th>Bookings</th>
        </tr>
      </thead>
      <tbody>
        {movies.map(m => (
          <tr key={m.movieId}>
            <td>{m.rank}</td>
            <td>{m.movieTitle}</td>
            <td>{m.totalRevenue.toLocaleString()}</td>
            <td>{m.totalBookings}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

**Last Updated:** March 25, 2026
