import { rateLimit } from "express-rate-limit";

const fifteenMinutes = 15 * 60 * 1000;

function createRateLimiter(limit, message) {
  return rateLimit({
    windowMs: fifteenMinutes,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler(_request, response) {
      response.status(429).json({ success: false, message });
    },
  });
}

export const apiRateLimit = createRateLimiter(
  120,
  "Too many requests. Please try again later.",
);

export const authRateLimit = createRateLimiter(
  10,
  "Too many authentication attempts. Please try again in 15 minutes.",
);
