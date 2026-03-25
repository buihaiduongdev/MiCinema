import cron from 'node-cron';
import { showtimeService } from '@/modules/showtimes/showtime.service';
import { bookingService } from '@/modules/bookings/booking.service';

export const startReleaseExpiredSeatsJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const [releasedSeats, cancelledBookings] = await Promise.all([
        showtimeService.releaseExpiredHolds(),
        bookingService.releaseExpiredBookings(),
      ]);

      if (releasedSeats > 0 || cancelledBookings > 0) {
        console.log(
          `[Job] Released ${releasedSeats} expired seat holds and cancelled ${cancelledBookings} expired bookings`
        );
      }
    } catch (error) {
      console.error('[Job] Error releasing expired seats:', error);
    }
  });

  console.log('✅ Scheduled: Release expired seats job (every minute)');
};
