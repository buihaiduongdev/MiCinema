/**
 * Age Rating — Giới hạn độ tuổi theo quy định CGV/Vietnam
 */
export const AGE_RATING = {
  P: 'P', // Phổ biến — mọi lứa tuổi
  C13: 'C13', // Cấm khán giả dưới 13 tuổi
  C16: 'C16', // Cấm khán giả dưới 16 tuổi
  C18: 'C18', // Cấm khán giả dưới 18 tuổi
} as const;

export type AgeRating = (typeof AGE_RATING)[keyof typeof AGE_RATING];

/**
 * Audio Type — Kiểu âm thanh phim
 * Phụ đề mặc định là tiếng Việt
 */
export const AUDIO_TYPE = {
  SUBTITLED: 'SUBTITLED', // Phim ngôn ngữ gốc + phụ đề tiếng Việt
  DUBBED: 'DUBBED', // Lồng tiếng Việt
} as const;

export type AudioType = (typeof AUDIO_TYPE)[keyof typeof AUDIO_TYPE];
