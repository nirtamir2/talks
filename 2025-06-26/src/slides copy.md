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
# TypeScript Without Surprises: Smarter Error Handling with Effect-TS

---
layout: intro
---

# Nir Tamir
- Senior Frontend Developer
- Passionate about type safety and developer experience
- [nirtamir.com](https://nirtamir.com)

<!--
My name is Nir Tamir. I've been doing frontend for over a decade, and today I want to show you how Effect-TS can fundamentally change how we handle errors in TypeScript.
-->

---
layout: center
---

# TypeScript is amazing at preventing errors

<!--
TypeScript has revolutionized how we write JavaScript by catching errors at compile time. It's brilliant at tracking success types and preventing type mismatches.
-->

---
transition: view-transition
---

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide("hi", 2);
//                   ~~~~~
```

<!--
If we pass the wrong type, TypeScript catches it immediately. This is fantastic - we get compile-time safety for our happy path scenarios.
-->

---
transition: view-transition
---

# But what about runtime edge cases?

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(10, 0); // Infinity
//    ^?
```

<!--
But what happens with edge cases? Division by zero returns Infinity - technically a valid number, but probably not what we expect. TypeScript can't help us here because the types are correct.
-->

---

# The unknown error problem

````md magic-move
```ts
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // error is unknown
}
```

```ts
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // error is unknown - no type safety!
  console.log(error.message); // ❌ TypeScript error
//            ~~~~~
}
```
````

<!--
When we do handle errors with try-catch, we completely lose type safety. The error is typed as unknown, forcing us to do manual type checking or unsafe casting.
-->

---

# Real-world complexity

````md magic-move
```ts
// Simple code...
const response = await fetch("/api/pokemon/ditto");
const data = await response.json();
const pokemon = schema.parse(data);
```

```ts
// Reality: What can go wrong?
const response = await fetch("/api/pokemon/ditto");
// - Network failure
// - DNS resolution failure
// - CORS issues
const data = await response.json();
// - Non-200 status codes (404, 500, etc.)
// - Invalid JSON syntax
const pokemon = schema.parse(data);
// - Schema validation failures
// - Missing required fields
```

```ts
// The try-catch nightmare
try {
  const response = await fetch("/api/pokemon/ditto");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  try {
    const data = await response.json();
    try {
      const pokemon = schema.parse(data);
      return pokemon;
    } catch (parseError) {
      throw new Error("Invalid data format");
    }
  } catch (jsonError) {
    throw new Error("Invalid JSON");
  }
} catch (fetchError) {
  throw new Error("Network failed");
}
```
````

<!--
What starts as 3 simple lines becomes a nightmare of nested try-catch blocks. Each operation can fail in multiple ways, and we lose track of what can go wrong where. Plus, all these errors are still unknown types.
-->

---

# The core problems

1. **Error types are unknown** - no compile-time safety
2. **Nested try-catch hell** - hard to read and maintain  
3. **No visibility into possible failures** - have to read implementation
4. **Can't compose error handling** - each function handles its own errors

<!--
These are the fundamental issues with TypeScript's error handling. We have amazing type safety for success cases, but errors are a black hole of unknowns.
-->

---
layout: center
---

# TypeScript tracks **success** types brilliantly

# But **error** types? Complete mystery.

---
layout: section
---

# Effect-TS: Typed Error Handling

---

# The Effect type

```ts twoslash
import type { Effect } from "effect";

//                     Success    Error       Context
//                        ↓         ↓           ↓
type MyEffect = Effect.Effect<string, TypeError, never>;
//                            ~~~~~~  ~~~~~~~~~
```

<!--
Effect is like Promise, but with typed errors. The type system now tracks both what you get when things work AND what can go wrong. This is the foundation of predictable error handling.
-->

---

# Creating Effects

````md magic-move
```ts
import { Effect } from "effect";

// Success
const success = Effect.succeed(42);
//    ^?

// Failure  
const failure = Effect.fail(new Error("Something went wrong"));
//    ^?
```

```ts
import { Effect, Data } from "effect";

// Tagged errors for better type safety
class DivisionByZeroError extends Data.TaggedError("DivisionByZeroError") {}

const success = Effect.succeed(42);
//    ^?

const failure = Effect.fail(new DivisionByZeroError());
//    ^?
```
````

<!--
Unlike Promise.resolve and Promise.reject, Effects don't execute immediately - they're descriptions of computations. Tagged errors give us discriminated unions for precise error handling.
-->

---

# From throwing to typed failures

````md magic-move
```ts
// Before: Unknown errors
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

// What errors can this throw? ¯\_(ツ)_/¯
```

```ts
import { Effect, Data } from "effect";

// After: Typed errors
class DivisionByZeroError extends Data.TaggedError("DivisionByZeroError") {}

function divide(a: number, b: number): Effect.Effect<number, DivisionByZeroError> {
  if (b === 0) {
    return Effect.fail(new DivisionByZeroError());
  }
  return Effect.succeed(a / b);
}

// Clear from the type signature: can fail with DivisionByZeroError
const result = divide(10, 2);
//    ^?
```
````

<!--
Now the function signature tells us exactly what can go wrong. No need to dive into implementation details - the types document all possible failure modes.
-->

---

# Composing effects naturally

````md magic-move
```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchData = Effect.tryPromise({
  try: () => fetch("/api/data"),
  catch: () => new NetworkError()
});

const parseJson = (response: Response) => Effect.tryPromise({
  try: () => response.json(),
  catch: () => new JsonError()
});
```

```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchData = Effect.tryPromise({
  try: () => fetch("/api/data"),
  catch: () => new NetworkError()
});

const parseJson = (response: Response) => Effect.tryPromise({
  try: () => response.json(),
  catch: () => new JsonError()
});

// Compose them - looks like happy path code!
const program = Effect.gen(function* () {
  const response = yield* fetchData;
  const data = yield* parseJson(response);
  return data;
});

// TypeScript automatically unions the error types
//    ^?
```
````

<!--
Using generators (similar to async/await), we write code that looks like the happy path. TypeScript automatically tracks all possible error types - NetworkError OR JsonError.
-->

---

# Error handling becomes explicit and typed

````md magic-move
```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchData = Effect.tryPromise({
  try: () => fetch("/api/data"),
  catch: () => new NetworkError()
});

const parseJson = (response: Response) => Effect.tryPromise({
  try: () => response.json(),
  catch: () => new JsonError()
});

const program = Effect.gen(function* () {
  const response = yield* fetchData;
  const data = yield* parseJson(response);
  return data;
});
```

```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class JsonError extends Data.TaggedError("JsonError") {}

const fetchData = Effect.tryPromise({
  try: () => fetch("/api/data"),
  catch: () => new NetworkError()
});

const parseJson = (response: Response) => Effect.tryPromise({
  try: () => response.json(),
  catch: () => new JsonError()
});

const program = Effect.gen(function* () {
  const response = yield* fetchData;
  const data = yield* parseJson(response);
  return data;
});

// Handle specific errors with full type safety
const safeProgram = program.pipe(
  Effect.catchTags({
    NetworkError: () => Effect.succeed("Offline mode"),
    JsonError: () => Effect.succeed("Invalid response format")
  })
);

//    ^?
```
````

<!--
We handle errors by their specific types, not with generic catch blocks. TypeScript provides autocomplete for all possible error types and ensures we handle them all.
-->

---

# Real-world example: Pokemon API

````md magic-move
```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly status?: number;
}> {}

class InvalidJsonError extends Data.TaggedError("InvalidJsonError") {}

class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string;
}> {}

const pokemonSchema = {
  parse: (data: any) => {
    if (!data.name) throw new Error("Missing name");
    return data as { name: string; id: number };
  }
};
```

```ts 
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError")<{
  readonly status?: number;
}> {}

class InvalidJsonError extends Data.TaggedError("InvalidJsonError") {}

class ValidationError extends Data.TaggedError("ValidationError")<{
  readonly field: string;
}> {}

const pokemonSchema = {
  parse: (data: any) => {
    if (!data.name) throw new Error("Missing name");
    return data as { name: string; id: number };
  }
};

const fetchPokemon = (name: string) => Effect.gen(function* () {
  // Step 1: Fetch data
  const response = yield* Effect.tryPromise({
    try: () => fetch(`https://pokeapi.co/api/v2/pokemon/${name}`),
    catch: () => new NetworkError({ status: 0 })
  });
  
  // Step 2: Check response status
  if (!response.ok) {
    return yield* Effect.fail(new NetworkError({ status: response.status }));
  }
  
  // Step 3: Parse JSON
  const data = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: () => new InvalidJsonError()
  });
  
  // Step 4: Validate data
  const pokemon = yield* Effect.try({
    try: () => pokemonSchema.parse(data),
    catch: () => new ValidationError({ field: "name" })
  });
  
  return pokemon;
});

//    ^?
```
````

<!--
Each step can fail with a specific error type. The function signature tells us exactly what can go wrong: network issues, JSON parsing problems, or validation failures. No surprises!
-->

---

# The magic: Separation of concerns

````md magic-move
```ts 
import { Effect, Data } from "effect";

class UserNotFound extends Data.TaggedError("UserNotFound") {}
class DatabaseError extends Data.TaggedError("DatabaseError") {}
class ValidationError extends Data.TaggedError("ValidationError") {}

declare const getUser: (id: string) => Effect.Effect<{id: string}, UserNotFound | DatabaseError>;
declare const validateUser: (user: {id: string}) => Effect.Effect<{id: string, valid: boolean}, ValidationError>;
declare const updateUser: (user: {id: string, valid: boolean}) => Effect.Effect<void, DatabaseError>;

// 1. Write business logic (happy path)
const updateUserProgram = (userId: string) => Effect.gen(function* () {
  const user = yield* getUser(userId);
  const validatedUser = yield* validateUser(user);
  yield* updateUser(validatedUser);
  return "User updated successfully";
});
```

```ts 
import { Effect, Data } from "effect";

class UserNotFound extends Data.TaggedError("UserNotFound") {}
class DatabaseError extends Data.TaggedError("DatabaseError") {}
class ValidationError extends Data.TaggedError("ValidationError") {}

declare const getUser: (id: string) => Effect.Effect<{id: string}, UserNotFound | DatabaseError>;
declare const validateUser: (user: {id: string}) => Effect.Effect<{id: string, valid: boolean}, ValidationError>;
declare const updateUser: (user: {id: string, valid: boolean}) => Effect.Effect<void, DatabaseError>;

const updateUserProgram = (userId: string) => Effect.gen(function* () {
  const user = yield* getUser(userId);
  const validatedUser = yield* validateUser(user);
  yield* updateUser(validatedUser);
  return "User updated successfully";
});

// 2. Handle errors separately and specifically
const safeUpdateUser = (userId: string) => updateUserProgram(userId).pipe(
  Effect.catchTags({
    UserNotFound: () => Effect.succeed("User not found - created new user"),
    DatabaseError: () => Effect.succeed("Database temporarily unavailable"),
    ValidationError: (error) => Effect.succeed(`Validation failed: ${error}`)
  })
);

//    ^?
```
````

<!--
This is the key insight: write your business logic first in the happy path style, then handle errors separately. The type system ensures you handle all possible error cases.
-->

---

# Running Effects

````md magic-move
```ts 
import { Effect, Data } from "effect";

class MyError extends Data.TaggedError("MyError") {}

const program = Effect.gen(function* () {
  return yield* Effect.succeed("Hello Effect!");
});
```

```ts 
import { Effect, Data } from "effect";

class MyError extends Data.TaggedError("MyError") {}

const program = Effect.gen(function* () {
  return yield* Effect.succeed("Hello Effect!");
});

// For synchronous effects
const syncResult = Effect.runSync(program);
console.log(syncResult); // "Hello Effect!"
```

```ts 
import { Effect, Data } from "effect";

class MyError extends Data.TaggedError("MyError") {}

const asyncProgram = Effect.gen(function* () {
  return yield* Effect.promise(() => Promise.resolve("Hello Async Effect!"));
});

// For asynchronous effects
Effect.runPromise(asyncProgram).then(console.log);
```
````

<!--
Effects are descriptions of programs - they don't run until you explicitly execute them with runSync or runPromise. This gives you full control over when and how your programs execute.
-->

---

# Integration with existing code

````md magic-move
```ts 
// Your existing async function
async function fetchUserData(id: string) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

```ts 
import { Effect, Data } from "effect";

class HttpError extends Data.TaggedError("HttpError")<{status: number}> {}
class NetworkError extends Data.TaggedError("NetworkError") {}

// Gradually convert to Effect
const fetchUserData = (id: string) => Effect.gen(function* () {
  const response = yield* Effect.tryPromise({
    try: () => fetch(`/api/users/${id}`),
    catch: () => new NetworkError()
  });
  
  if (!response.ok) {
    return yield* Effect.fail(new HttpError({ status: response.status }));
  }
  
  return yield* Effect.tryPromise({
    try: () => response.json(),
    catch: () => new NetworkError()
  });
});

//    ^?
```
````

<!--
You don't need to rewrite everything at once. Start with one function, gradually converting your codebase. Effect plays well with existing TypeScript code.
-->

---

# Before vs After comparison

<div class="grid grid-cols-2 gap-8">

<div>

## Traditional TypeScript
- ✅ Type safety for success cases
- ❌ Unknown error types  
- ❌ Nested try-catch complexity
- ❌ Hidden failure modes
- ❌ Generic error handling

</div>

<div>

## With Effect-TS
- ✅ Type safety for success cases
- ✅ Typed error handling
- ✅ Happy path code style
- ✅ Explicit failure modes
- ✅ Precise error recovery

</div>

</div>

<!--
Effect doesn't replace TypeScript's strengths - it extends them to cover the error handling gap. You get the best of both worlds: readable happy path code with comprehensive error tracking.
-->

---

# Key benefits recap

1. **Write happy path code** - no nested try-catch blocks
2. **Get precise error information** - know exactly what can fail
3. **Type-driven error handling** - compile-time safety for errors
4. **Composable error recovery** - handle errors at the right level
5. **No implementation reading** - error types are in the signature

<!--
These are the core benefits that address the pain points we started with. Effect transforms error handling from a TypeScript weakness into a strength.
-->

---

# Getting started

```ts twoslash
// Install Effect
// npm install effect

import { Effect, Data } from "effect";

// Start with one function
class MyError extends Data.TaggedError("MyError") {}

const myFunction = (input: string): Effect.Effect<string, MyError> => {
  if (input === "") {
    return Effect.fail(new MyError());
  }
  return Effect.succeed(input.toUpperCase());
};

// Use it
const program = myFunction("hello");
const result = Effect.runSync(program); // "HELLO"
```

<!--
Start small - convert one error-prone function to use Effect. You'll immediately see the benefits in your type signatures and error handling.
-->

---
layout: center
---

# TypeScript finally tracks **both** success AND error types

---

# Questions?

### Resources:
- [effect.website](https://effect.website) - Official documentation
- [Effect Discord](https://discord.gg/effect-ts) - Community support  
- [GitHub examples](https://github.com/Effect-TS/effect/tree/main/examples)

<!--
Effect has an amazing community and comprehensive documentation. The Discord is particularly helpful for getting started and asking questions.
-->

---
layout: center
---

# Thank you!

*Write TypeScript without surprises.*  
*Handle errors with confidence.*

<!--
Effect transforms error handling from TypeScript's biggest weakness into one of its greatest strengths. Your future self will thank you for the predictability and type safety.
-->