import { z } from "zod";

export const ExampleSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type ExampleType = z.infer<typeof ExampleSchema>;
