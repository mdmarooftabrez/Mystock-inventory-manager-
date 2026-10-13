import jwt from "jsonwebtoken";

export function requireAuth(request, response, next) {
  try {
    const token = request.cookies.token;

    if (!token) {
      return response.status(401).json({
        success: false,
        message: "Please log in first.",
      });
    }

    request.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return response.status(401).json({
      success: false,
      message: "Your login has expired. Please log in again.",
    });
  }
}
