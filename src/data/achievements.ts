export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  requirement: {
    type: 'games_played' | 'correct_answers' | 'streak' | 'level' | 'geese_count' | 'daily_streak';
    value: number;
  };
}

export const achievements: Achievement[] = [
  // Herní milníky
  {
    id: 'first_game',
    name: 'První kroky',
    description: 'Zahraj svou první mini-hru',
    emoji: '🎮',
    requirement: { type: 'games_played', value: 1 },
  },
  {
    id: 'games_10',
    name: 'Pilný žák',
    description: 'Zahraj 10 mini-her',
    emoji: '📚',
    requirement: { type: 'games_played', value: 10 },
  },
  {
    id: 'games_50',
    name: 'Pravopisný mistr',
    description: 'Zahraj 50 mini-her',
    emoji: '🎓',
    requirement: { type: 'games_played', value: 50 },
  },
  {
    id: 'games_100',
    name: 'Veterán',
    description: 'Zahraj 100 mini-her',
    emoji: '🏆',
    requirement: { type: 'games_played', value: 100 },
  },

  // Správné odpovědi
  {
    id: 'correct_10',
    name: 'Začátečník',
    description: 'Odpověz správně 10krát',
    emoji: '✅',
    requirement: { type: 'correct_answers', value: 10 },
  },
  {
    id: 'correct_100',
    name: 'Pokročilý',
    description: 'Odpověz správně 100krát',
    emoji: '⭐',
    requirement: { type: 'correct_answers', value: 100 },
  },
  {
    id: 'correct_500',
    name: 'Expert',
    description: 'Odpověz správně 500krát',
    emoji: '🌟',
    requirement: { type: 'correct_answers', value: 500 },
  },
  {
    id: 'correct_1000',
    name: 'Génius',
    description: 'Odpověz správně 1000krát',
    emoji: '💎',
    requirement: { type: 'correct_answers', value: 1000 },
  },

  // Streak
  {
    id: 'streak_5',
    name: 'Série!',
    description: 'Dosáhni série 5 správných odpovědí',
    emoji: '🔥',
    requirement: { type: 'streak', value: 5 },
  },
  {
    id: 'streak_10',
    name: 'Husí horečka',
    description: 'Dosáhni série 10 správných odpovědí',
    emoji: '🪿',
    requirement: { type: 'streak', value: 10 },
  },
  {
    id: 'streak_20',
    name: 'Neporazitelný',
    description: 'Dosáhni série 20 správných odpovědí',
    emoji: '👑',
    requirement: { type: 'streak', value: 20 },
  },

  // Level
  {
    id: 'level_5',
    name: 'Level 5',
    description: 'Dosáhni levelu 5',
    emoji: '5️⃣',
    requirement: { type: 'level', value: 5 },
  },
  {
    id: 'level_10',
    name: 'Level 10',
    description: 'Dosáhni levelu 10',
    emoji: '🔟',
    requirement: { type: 'level', value: 10 },
  },
  {
    id: 'level_25',
    name: 'Zkušený farmář',
    description: 'Dosáhni levelu 25',
    emoji: '🌾',
    requirement: { type: 'level', value: 25 },
  },

  // Husy
  {
    id: 'geese_3',
    name: 'Malé hejno',
    description: 'Vlastni 3 husy',
    emoji: '🪿',
    requirement: { type: 'geese_count', value: 3 },
  },
  {
    id: 'geese_5',
    name: 'Husí farma',
    description: 'Vlastni 5 hus',
    emoji: '🦢',
    requirement: { type: 'geese_count', value: 5 },
  },
  {
    id: 'geese_10',
    name: 'Velká farma',
    description: 'Vlastni 10 hus',
    emoji: '🦆',
    requirement: { type: 'geese_count', value: 10 },
  },

  // Denní streak
  {
    id: 'daily_3',
    name: 'Pravidelný hráč',
    description: 'Hraj 3 dny v řadě',
    emoji: '📅',
    requirement: { type: 'daily_streak', value: 3 },
  },
  {
    id: 'daily_7',
    name: 'Týdenní výzva',
    description: 'Hraj 7 dní v řadě',
    emoji: '🗓️',
    requirement: { type: 'daily_streak', value: 7 },
  },
  {
    id: 'daily_30',
    name: 'Měsíční mistr',
    description: 'Hraj 30 dní v řadě',
    emoji: '🏅',
    requirement: { type: 'daily_streak', value: 30 },
  },
];

export function checkAchievementUnlocked(
  achievement: Achievement,
  stats: {
    gamesPlayed: number;
    correctAnswers: number;
    bestStreak: number;
    level: number;
    geeseCount: number;
    dailyStreak: number;
  }
): boolean {
  const { type, value } = achievement.requirement;

  switch (type) {
    case 'games_played':
      return stats.gamesPlayed >= value;
    case 'correct_answers':
      return stats.correctAnswers >= value;
    case 'streak':
      return stats.bestStreak >= value;
    case 'level':
      return stats.level >= value;
    case 'geese_count':
      return stats.geeseCount >= value;
    case 'daily_streak':
      return stats.dailyStreak >= value;
    default:
      return false;
  }
}
