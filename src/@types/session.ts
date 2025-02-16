export type Session = {
  id: number;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
};
