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

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface MealBox {
  title: string;
  emoji: string;
  bg: string;
  price: number;
  description?: string;
  isNew?: boolean;
  dishes?: MealBox[];
  tags?: string[];
  category?: string;
  image: string;
}

export interface ReviewsByMeal {
  [mealName: string]: Review[];
}

export interface DeliveryInfo {
  address: string;
  instructions?: string;
  phone?: string;
}