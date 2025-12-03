import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const ReviewDataSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  content: z.string(),
  images: z.array(z.string()), // 배열은 S3 URL 문자열 목록으로 기대
  reservation_id: z.number().optional(),
  rating: z.number(),
  visited: z.boolean(),
  created_at: z.string(),
  user: UserSchema,
});

export const ReviewDataArraySchema = z.array(ReviewDataSchema);

export type ReviewData_t = z.infer<typeof ReviewDataSchema>;
