import { create } from 'zustand';
import type { Exercise, ExerciseCategory } from '../types/farm';

// Import JSON dat
import prefixesData from '../data/exercises/prefixes.json';
import softHardIYData from '../data/exercises/softHardIY.json';
import declaredWordsData from '../data/exercises/declaredWords.json';
import vowelLengthData from '../data/exercises/vowelLength.json';
import sentencesData from '../data/exercises/sentences.json';
import fractionsData from '../data/exercises/fractions.json';

interface ExerciseState {
  exercises: Record<ExerciseCategory, Exercise[]>;
  currentExercise: Exercise | null;
  usedExerciseIds: Set<string>;

  // Actions
  getRandomExercise: (category: ExerciseCategory, maxDifficulty?: number) => Exercise | null;
  markExerciseUsed: (id: string) => void;
  resetUsedExercises: () => void;
  getExercisesByDifficulty: (
    category: ExerciseCategory,
    difficulty: number
  ) => Exercise[];
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exercises: {
    prefixes: prefixesData.exercises as Exercise[],
    softHardIY: softHardIYData.exercises as Exercise[],
    declaredWords: declaredWordsData.exercises as Exercise[],
    vowelLength: vowelLengthData.exercises as Exercise[],
    sentences: sentencesData.exercises as Exercise[],
    fractions: fractionsData.exercises as Exercise[],
  },
  currentExercise: null,
  usedExerciseIds: new Set(),

  getRandomExercise: (category, maxDifficulty = 5) => {
    const state = get();
    const categoryExercises = state.exercises[category];

    // Filtrovat podle obtížnosti a nepoužitých
    const available = categoryExercises.filter(
      (ex) =>
        ex.difficulty <= maxDifficulty && !state.usedExerciseIds.has(ex.id)
    );

    if (available.length === 0) {
      // Reset pokud jsme prošli všechny
      set({ usedExerciseIds: new Set() });
      return categoryExercises.filter((ex) => ex.difficulty <= maxDifficulty)[
        Math.floor(
          Math.random() *
            categoryExercises.filter((ex) => ex.difficulty <= maxDifficulty)
              .length
        )
      ];
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const exercise = available[randomIndex];

    set({ currentExercise: exercise });
    return exercise;
  },

  markExerciseUsed: (id) =>
    set((state) => ({
      usedExerciseIds: new Set([...state.usedExerciseIds, id]),
    })),

  resetUsedExercises: () => set({ usedExerciseIds: new Set() }),

  getExercisesByDifficulty: (category, difficulty) => {
    return get().exercises[category].filter(
      (ex) => ex.difficulty === difficulty
    );
  },
}));
