export interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
}

export interface Review {
  id: string;
  comment: string;
  rating: number;
  user: {
    name: string;
    uid: string;
  };
  timestamp: any; // Firestore timestamp
}

export interface MealBox {
  title: string;
  emoji: string;
  bg: string;
}

export interface ReviewsByMeal {
  [mealName: string]: Review[];
}