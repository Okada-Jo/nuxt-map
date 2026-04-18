import z from 'zod';

export const SearchSchema = z.object({
  q: z.string().min(1, 'Please enter a search term'),
});

export type SearchSchema = z.infer<typeof SearchSchema>;

export const NameSchema = z.string().min(1).max(128);
export const DescrptionSchema = z.string().max(1024).or(z.null());
export const LatSchema = z.coerce.number().min(-90).max(90);
export const LongSchema = z.coerce.number().min(-180).max(180);
