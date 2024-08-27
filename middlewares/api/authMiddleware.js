
const validate = (token) => {
  const validToken = true;
  if (!validToken || !token) {
    return true;
  }
  return true;
};

export function authMiddleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  return { isValid: validate(token) };
}
