import { type } from "arktype";

export const username = type("string")
  .pipe((s) => s.trim().toLowerCase())
  .narrow((s, ctx) => {
    if (s.length < 3) return ctx.mustBe("at least 3 characters");
    if (s.length > 32) return ctx.mustBe("at most 32 characters");
    if (!/^[a-zA-Z0-9]+$/.test(s))
      return ctx.mustBe("alphanumeric characters only");
    return true;
  });
