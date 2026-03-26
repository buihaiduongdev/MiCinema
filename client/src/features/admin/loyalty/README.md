# Member Ranking & Loyalty Interface

## 📋 Overview

Giao diện quản lý bảng xếp hạng thành viên và theo dõi loyalty points dựa trên API hiện có của backend.

## ✅ API Endpoints Được Sử Dụng

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/loyalty/ranking/points` | GET | Lấy top members sorted by loyalty points | ✅ Available |
| `/api/loyalty/ranking/tier` | GET | Lấy top members sorted by membership tier | ✅ Available |
| `/api/loyalty/ranking` | GET | Lấy detailed ranking (deprecated, not used) | ✅ Available |

### Query Parameters
- `limit`: Number of members to return (default: 10, max: 100)
- `sortBy`: Sort criteria - 'points' \| 'tier' (for detailed endpoint)

### Response Format
```json
{
  "data": [
    {
      "rank": 1,
      "userId": "507f1f77bcf86cd799439011",
      "fullName": "Marcus Sterling",
      "email": "marcus@example.com",
      "loyaltyPoints": 24580,
      "membershipTier": "GOLD",
      "avatar": "https://...",
      "memberSince": "2021-10-15T00:00:00Z"
    }
  ],
  "success": true,
  "message": "Lấy bảng xếp hạng thành viên theo điểm thành công"
}
```

## 🎨 UI Components

### 1. **Tier Overview Cards** (3-column grid)
- **Gold Elite**: Displays gold tier member count with trending icon
- **Silver Star**: Displays silver tier member count with users icon
- **Bronze Basic**: Displays bronze tier member count with users icon

Each card shows:
- Tier name and badge
- Member count
- Trending indicator or icon
- Hover effect with background color change

### 2. **Tier Filter Breakdown**
Calculates total members per tier from API data:
- `tierBreakdown.gold`: Count of GOLD tier members
- `tierBreakdown.silver`: Count of SILVER tier members  
- `tierBreakdown.bronze`: Count of BRONZE tier members

### 3. **Top Spenders Table**
Displays member ranking with:
- **Rank**: Numbered badge with circular background
- **Member Name**: Avatar + full name + email
- **Tier**: Badge with color-coded tier label (GOLD/SILVER/BRONZE)
- **Loyalty Points**: Formatted number with thousand separators
- **Member Since**: Localized date (vi-VN format)
- **Actions**: "View Profile" button

### 4. **Controls & Filters**
- **Sort By**: Dropdown to switch between points and tier sorting
- **Filter By Tier**: Dropdown to filter by specific tier or show all
- **Filter Button**: Reserved for future advanced filters

### 5. **Pagination**
- Shows first 20 members by default
- "View More Members" button to load next 20
- Max 100 members displayable

## 🪝 React Query Hooks

Located in `src/features/admin/loyalty/hooks/useLoyaltyStats.ts`

### `useMemberRankingByPoints(limit = 10)`
Fetches members sorted by loyalty points (highest first)

```typescript
const { data, isLoading, error } = useMemberRankingByPoints(20);
```

### `useMemberRankingByTier(limit = 100)`
Fetches members sorted by membership tier (GOLD > SILVER > BRONZE), then by points

```typescript
const { data, isLoading, error } = useMemberRankingByTier(100);
```

### `useTierStats(limit = 1000)`
Calculates tier distribution statistics from ranking data

```typescript
const { tierBreakdown, isLoading } = useTierStats();
// Returns: { gold: 1284, silver: 4592, bronze: 12408 }
```

### `calculateTierOverview(members: RankingMember[])`
Utility function to group and count members by tier

## 📍 Route Configuration

```typescript
// In admin routes config
{
  path: 'loyalty/ranking',
  element: <MemberRankingPage />,
  name: 'Bảng xếp hạng',
  icon: 'Trophy',
}
```

**Access URL**: `/admin/loyalty/ranking`

## 🎯 Features Implemented

### ✅ Completed
1. Dark theme UI matching admin design system
2. Tier overview cards with dynamic counts
3. Member ranking table with sorting and filtering
4. Responsive layout (mobile, tablet, desktop)
5. Loading states with spinner
6. Empty state when no members found
7. Pagination with "View More" functionality
8. Real API integration via React Query hooks
9. Tier-based color coding (Gold: blue, Silver: gray, Bronze: orange)
10. Avatar display with fallback icon

### ❌ Not Implemented (No API Available)
1. **Loyalty Perks Management**: No backend API for perks CRUD
   - Could be added if `/api/loyalty/perks` endpoint is created
   
2. **Member Detailed Profile**: Currently shows only ranking table
   - Could be expanded with member detail modal/page if needed
   
3. **Recent Bookings in Profile**: No dedicated endpoint for member's bookings history
   - Could use `/api/bookings?userId=xxx` if admin can access

4. **System Alerts**: No alerts management API
   - Could be added if alert system is implemented

## 🎨 Dark Theme Colors

```css
/* Background */
--surface: #0b1326
--surface-container: #131b2e
--surface-container-low: #0b1326

/* Text */
--on-surface: #dae2fd
--on-surface-variant: #8c90a1

/* Tier Colors */
--primary-container: #0066ff (Gold tier)
--tertiary-container: #d72f2d (Bronze tier)
--slate-500: #64748b (Silver tier)
```

## 🔄 Data Flow

```
MemberRankingPage
├── useMemberRankingByPoints(displayLimit)
│   └── GET /api/loyalty/ranking/points?limit=X
│       └── Returns: RankingMember[]
├── useMemberRankingByTier(displayLimit) 
│   └── GET /api/loyalty/ranking/tier?limit=X
│       └── Returns: RankingMember[]
└── useTierStats(1000)
    └── useMemberRankingByTier(1000)
        └── calculates tierBreakdown { gold, silver, bronze }
```

## 🚀 Future Enhancements

1. **Export to PDF**: Implement PDF export with ranking table data
2. **Member Detail Modal**: Click "View Profile" to show member details
3. **Tier Upgrade/Downgrade**: Admin controls to manually adjust member tier
4. **Loyalty History**: Show transaction history (earn/redeem/expire points)
5. **Bulk Actions**: Select multiple members for batch operations
6. **Advanced Filtering**: Filter by join date, total spent, last activity
7. **Chart Analytics**: Visualize tier distribution and point trends

## 📝 Notes

- All member data comes directly from database queries in backend
- No mock data is used (except for unmapped features above)
- Tier calculations are based on `User.membershipTier` field
- All timestamps use user's timezone (vi-VN locale by default)
- API responses are cached by React Query with default stale time

## 🔗 Related Files

- Component: `client/src/features/admin/loyalty/pages/MemberRankingPage.tsx`
- Hooks: `client/src/features/admin/loyalty/hooks/useLoyaltyStats.ts`
- Routes: `client/src/features/admin/routes.tsx`
- API Service: `client/src/lib/api-client.ts`
- Backend Service: `server/src/modules/loyalty/loyalty.service.ts`
- Backend Controller: `server/src/modules/loyalty/loyalty.controller.ts`
