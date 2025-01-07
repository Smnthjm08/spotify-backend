import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds?: number) => {
  return bcrypt.hash(value, saltRounds || 10);
};

export const compareValues = async (value: string, hashedValue: string) => {
  bcrypt.compare(value, hashedValue).catch(() => false);
};
