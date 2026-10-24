const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function requireSameOrigin(allowedOrigin) {
  const expectedOrigin = new URL(allowedOrigin).origin;

  return (request, response, next) => {
    if (SAFE_METHODS.has(request.method)) return next();

    const origin = request.get("origin");
    const hasInvalidOrigin = origin && origin !== expectedOrigin;
    const cookieWithoutOrigin = !origin && request.cookies?.token;

    if (hasInvalidOrigin || cookieWithoutOrigin) {
      return response.status(403).json({
        success: false,
        message: "This request origin is not allowed.",
      });
    }

    return next();
  };
}
