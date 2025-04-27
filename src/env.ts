import console from "consola";
import { z } from "zod";
import { fromError } from "zod-validation-error";

const dnsLabelName = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/;

const envSchema = z.object({
  MACHINE_NAME: z
    .string()
    .min(1, { message: "Must be at least 1 character long" })
    .max(63, { message: "Must be at most 63 characters long" })
    .regex(dnsLabelName, {
      message: `Must be a valid DNS label ${dnsLabelName}`,
    }),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  const error = fromError(env.error);
  console.error(
    `Environment variable validation failed. ${error.message}. Please check your environment variables.`,
  );
  process.exit(1);
}

export default env.data;
