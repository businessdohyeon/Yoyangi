import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number(),
    name: z.string(),
});

export const ReviewDataSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    content: z.string(),
    images: z.array(z.any()), // TODO: 이후 세부 구현
    rating: z.number(),
    visited: z.boolean(),
    created_at: z.string().datetime(),
    user: UserSchema,
});

export const ReviewDataArraySchema = z.array(ReviewDataSchema);

export type ReviewData_t = z.infer<typeof ReviewDataSchema>;
