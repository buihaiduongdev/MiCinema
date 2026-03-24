export const PERSON_ROLE = {
  ACTOR: 'ACTOR',
  DIRECTOR: 'DIRECTOR',
} as const;

export type PersonRole = (typeof PERSON_ROLE)[keyof typeof PERSON_ROLE];
