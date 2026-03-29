import { z } from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().min(3, 'Full Name must be at least 3 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterRequest = z.infer<typeof signUpSchema>;