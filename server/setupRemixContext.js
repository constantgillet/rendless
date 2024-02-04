export async function setupRemixContext(req, res, next) {
  res.locals.name = "test2";
  next();
}
