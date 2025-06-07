import { Data, Effect, UnexpectedException } from "effect";

class CannotDivideByZeroError extends Data.TaggedError(
  "CannotDivideByZeroError",
) {}

class CannotFetchNumber extends Data.TaggedError("CannotFetchNumber") {}

function divide(
  a: number,
  b: number,
): Effect.Effect<number, CannotDivideByZeroError> {
  if (b === 0) {
    return Effect.fail(new CannotDivideByZeroError());
  }
  return Effect.succeed(a / b);
}

const fetchNumberWithUnexpectedException = Effect.tryPromise(() => {
  return Promise.resolve(42);
});

const fetchNumber = (max: number) =>
  Effect.tryPromise({
    try: () => Promise.resolve(Math.random() * max),
    catch: () => new CannotFetchNumber(),
  });

// ---cut-before---

//      ┌─── Effect<number, UnexpectedException | CannotFetchNumber | CannotDivideByZeroError, never>
//      ▼
const program = Effect.gen(function* () {
  const numerator = yield* fetchNumberWithUnexpectedException;
  const denumerator = yield* fetchNumber(20);
  return yield* divide(numerator, denumerator);
});

//      ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    UnexpectedException: (_UnexpectedException) =>
      Effect.succeed(`Recovering from UnexpectedException`),
    CannotDivideByZeroError: (_CannotDivideByZeroError) =>
      Effect.succeed(`Recovering from CannotDivideByZeroError`),
  }),
);

//                   ┌─── Effect<number, UnexpectedException | CannotFetchNumber | CannotDivideByZeroError, never>
//                   ▼
Effect.runPromise(recovered).then(console.log);
