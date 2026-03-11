export interface User {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'admin';
  joined: string;
  status: 'active' | 'inactive';
}

export interface Course {
  id: number;
  title: string;
  category: string;
  level: string;
  courseNumber: string;
  price: number;
  image: string;
  duration: string;
  description: string;
}

export interface Booking {
  id: string | number;
  userId: string;
  courseId: number;
  status: 'pending' | 'confirmed';
  date: string;
  phone: string;
  address: string;
}
