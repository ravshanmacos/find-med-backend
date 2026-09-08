export type MessageLang = {
  [key: string]: string;
};

export const ERROR_MESSAGES = {
  UNSAFE_SQL: {
    en: 'SQL injection attempt detected',
    ru: 'Обнаружена попытка SQL-инъекции',
    uz: "SQL in'ektsiya urinishi aniqlandi",
  },
  EMAIL_ALREADY_EXISTS: {
    en: 'This email is already registered',
    ru: 'Этот email уже зарегистрирован',
    uz: "Bu email allaqachon ro'yxatdan o'tgan",
  },
  INVALID_CREDENTIALS: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль',
    uz: "Email yoki parol noto'g'ri",
  },
  ACCOUNT_INACTIVE: {
    en: 'Account is not active',
    ru: 'Аккаунт неактивен',
    uz: 'Akkaunt faol emas',
  },
  INVALID_REFRESH_TOKEN: {
    en: 'Refresh token is invalid or expired',
    ru: 'Refresh токен недействителен или истёк',
    uz: 'Refresh token yaroqsiz yoki muddati tugagan',
  },
  DOCTOR_NOT_FOUND: {
    en: 'Doctor not found',
    ru: 'Врач не найден',
    uz: 'Shifokor topilmadi',
  },
  DOCTOR_ALREADY_LINKED: {
    en: 'This doctor already has an account',
    ru: 'У этого врача уже есть аккаунт',
    uz: 'Bu shifokorning akkaunti allaqachon mavjud',
  },
  INVALID_OR_EXPIRED_INVITE: {
    en: 'Invite is invalid or has expired',
    ru: 'Приглашение недействительно или истекло',
    uz: 'Taklif yaroqsiz yoki muddati tugagan',
  },
  NOT_PROFILE_OWNER: {
    en: 'You can only edit your own profile',
    ru: 'Вы можете редактировать только свой профиль',
    uz: "Siz faqat o'z profilingizni tahrirlay olasiz",
  },
};
