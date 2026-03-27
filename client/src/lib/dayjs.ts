/**
 * Day.js Config
 *
 * Import plugins: relativeTime, locale vi
 * Export: configured dayjs instance
 */

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

// Enable plugins
dayjs.extend(relativeTime);
dayjs.locale('vi');

export default dayjs;
