const _JWT_SECRET = process.env.JWT_SECRET;

if (!_JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const JWT_SECRET = _JWT_SECRET;
