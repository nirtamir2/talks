---
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
layout: center
glowSeed: 4
lang: en-US
title: "TypeScript Without Surprises: Smarter Error Handling with Effect-TS"
---

![](./nirtamir-animate.svg){.w-30.mt--10.mb-5}

<!--
TypeScript Without Surprises: Smarter Error Handling with Effect-TS
-->

---
layout: center
---

# TypeScript Without Surprises: Smarter Error Handling with Effect-TS

<!--
This talk will hopefully change the way you think about handling errors in TypeScript. 🟡
We’ll do that using the Effect library.
-->

---
title: "About me"
layout: intro
glowSeed: 15
glowOpacity: 0.3
class: pl-25
---

# Nir Tamir

- Senior Frontend developer
- Loves open source and tooling
- <mdi-web /> [nirtamir.com](https://nirtamir.com)

<!-- - <mdi-github /> [@nirtamir2](https://github.com/nirtamir2)
- <mdi-twitter /> [@NirTamir](https://twitter.com/NirTamir)
- <mdi-linkedin /> [@nirtamir2](https://linkedin.com/in/nirtamir2) -->

<!--
My name is Nir Tamir.
I’ve been doing frontend for over a decade.
You can find more about me at nirtamir.com.
-->

---

# TypeScript is amazing at preventing errors

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

divide("hi", 4);
```

---

# Until it isn't

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(10, 0); // Infinity 🤔
```

<!--
TypeScript catches type errors beautifully, but runtime errors? Not so much. Division by zero returns Infinity - technically correct, but probably not what we want
-->

---

# The try-catch problem

```ts
try {
  const result = divide(4, 0);
} catch (error) {
  // `error` is unknown - no type safety!
  console.log(error.message); // ❌ TypeScript error
}
```

<!--
When we do handle errors with try-catch, we lose all type safety. The error is typed as `unknown`, forcing us to do manual type checking.
-->

---

# Real-world complexity explodes

````md magic-move
```ts
// Simple code...
const response = await fetch("/api/data");
const data = await response.json();
const parsed = schema.parse(data);
```

```ts
// Reality...
try {
  const response = await fetch("/api/data");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  try {
    const data = await response.json();
    try {
      const parsed = schema.parse(data);
      return parsed;
    } catch (parseError) {
      throw new Error("Invalid data format");
    }
  } catch (jsonError) {
    throw new Error("Invalid JSON response");
  }
} catch (fetchError) {
  throw new Error("Network request failed");
}
```
````

<!--
What starts as 3 simple lines becomes a nightmare of nested try-catch blocks. Each async operation can fail in different ways, and we lose track of what can go wrong where.
-->

---
layout: center
---

# TypeScript tracks **success** types brilliantly

# But **error** types? Unknown territory.

---
layout: section
---

# Enter Effect-TS

_"Make the impossible states impossible"_

---

# The Effect type

```ts
//   Success      Error          Context
//      ↓           ↓               ↓
Effect<Data, ErrorType, Requirements>;
```

- **Success type**: What you get when things go right
- **Error type**: What can go wrong (typed!)
- **Context**: What you need to run this (we'll ignore this today)

<!--
Effect is like Promise, but with typed errors. The type system now tracks both success and failure cases.
-->

---

# From throwing to failing

````md magic-move
```ts
// Before: Throws unknown errors
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

```ts
// After: Typed errors
import { Data, Effect } from "effect";

class DivisionByZeroError extends Data.TaggedError("DivisionByZeroError") {}

function divide(a: number, b: number): Effect<number, DivisionByZeroError> {
  if (b === 0) {
    return Effect.fail(new DivisionByZeroError());
  }
  return Effect.succeed(a / b);
}
```
````

<!--
Instead of throwing, we return Effect.fail() or Effect.succeed(). The type system now knows exactly what can go wrong.
-->

---

# Composing effects

```ts
const program = Effect.gen(function* () {
  const response = yield* fetchData();
  const json = yield* parseJson(response);
  const validated = yield* validateData(json);
  return validated;
});

// Type: Effect<ValidatedData, FetchError | JsonError | ValidationError>
```

<!--
Using generators (similar to async/await), we can compose effects naturally. TypeScript automatically unions all possible error types.
-->

---

# Error handling becomes explicit

```ts
const safeProgram = program.pipe(
  Effect.catchTags({
    FetchError: () => Effect.succeed("Network is down"),
    JsonError: () => Effect.succeed("Invalid response format"),
    ValidationError: (error) => Effect.succeed(`Bad data: ${error.message}`),
  }),
);

// Type: Effect<ValidatedData | string, never>
```

<!--
We handle errors by their specific types, not with generic catch blocks. TypeScript provides autocomplete for all possible error types.
-->

---

# Real-world example: API calls

```ts
class NetworkError extends Data.TaggedError("NetworkError") {}
class InvalidJsonError extends Data.TaggedError("InvalidJsonError") {}
class ValidationError extends Data.TaggedError("ValidationError") {}

const fetchPokemon = (name: string) =>
  Effect.gen(function* () {
    const response = yield* Effect.tryPromise({
      try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
      catch: () => new NetworkError(),
    });

    if (!response.ok) {
      return yield* Effect.fail(new NetworkError());
    }

    const data = yield* Effect.tryPromise({
      try: () => response.json(),
      catch: () => new InvalidJsonError(),
    });

    const pokemon = yield* Effect.try({
      try: () => pokemonSchema.parse(data),
      catch: () => new ValidationError(),
    });

    return pokemon;
  });

// Type: Effect<Pokemon, NetworkError | InvalidJsonError | ValidationError>
```

<!--
Each step can fail with a specific error type. The final type signature tells us exactly what can go wrong and why.
-->

---

# The magic: Separation of concerns

```ts
// 1. Define your program (happy path)
const program = Effect.gen(function* () {
  const user = yield* getUser(userId);
  const preferences = yield* getUserPreferences(user.id);
  const recommendations = yield* getRecommendations(preferences);
  return recommendations;
});

// 2. Handle errors separately
const safeProgram = program.pipe(
  Effect.catchTags({
    UserNotFound: () => Effect.succeed([]),
    PreferencesError: () => getDefaultRecommendations(),
    RecommendationServiceDown: () => getCachedRecommendations(),
  }),
);
```

<!--
Write your business logic first, handle errors second. This separation makes code more readable and maintainable.
-->

---

# Before vs After

**Traditional TypeScript:**

- ✅ Type safety for success cases
- ❌ Unknown error types
- ❌ Nested try-catch hell
- ❌ No compile-time error tracking

**With Effect:**

- ✅ Type safety for success cases
- ✅ Typed error handling
- ✅ Composable error recovery
- ✅ Compile-time error tracking

---
layout: center
---

# TypeScript tracks **values**

# Effect tracks **values** AND **errors**

---

# Getting started

```bash
npm install effect
```

```ts
import { Data, Effect } from "effect";

// Start small: convert one error-prone function
class MyError extends Data.TaggedError("MyError") {}

const myFunction = (): Effect<string, MyError> => {
  // Your logic here
};
```

<!--
You don't need to rewrite everything at once. Start with one function, then gradually expand. Effect plays well with existing TypeScript code.
-->

---

# Key takeaways

1. **Make errors visible** in your type signatures
2. **Separate program logic** from error handling
3. **Compose effects** like you compose functions
4. **Handle specific errors** instead of generic ones
5. **Let TypeScript guide you** to handle all error cases

---
layout: center
---

# Questions?

### Resources:

- [effect.website](https://effect.website)
- [Effect-TS Discord](https://discord.gg/effect-ts)
- This talk: [nirtamir.com/talks/effect-errors](https://nirtamir.com/talks/effect-errors)

---
layout: center
---

# Thank you!

_No more surprises. Just predictable, typed error handling._
