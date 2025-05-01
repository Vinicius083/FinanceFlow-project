export const userValidation = (
  name: string,
  email: string,
  password: string
) => {
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return Error("Invalid input types");
  }

  if (name.trim().length === 0) return Error("Name cannot be empty");

  if (!name || !email || !password)
    return Error("Name, email, and password are required");

  return "valid";
};
