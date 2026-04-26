export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
}

export type UserForm = Omit<User, 'id'>;
