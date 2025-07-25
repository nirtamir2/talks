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
Hi everyone! Today I want to show you how to eliminate surprises from your TypeScript code using Effect. By the end of this talk, you'll see errors in a completely different way.
-->

---
layout: center
---

# TypeScript Without Surprises: Smarter Error Handling with Effect-TS

<!--
We're going to explore how Effect can transform the way you handle errors in TypeScript applications.
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

<!--
I'm Nir Tamir, a senior frontend developer with over a decade of experience.
You can find more about me at nirtamir.com.
-->

---
layout: section
---

# TypeScript is amazing

<!--
Let's start with what we all know - TypeScript is amazing at catching errors before they happen.
-->

---

# TypeScript catches type errors

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide("hi", 2);
//    ^?
```

<!--
When we pass the wrong types to a function, TypeScript catches it immediately. This is fantastic - we get compile-time safety and great inference for our return types.
-->

---

# But what about runtime surprises?

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(4, 0); // Infinity
//    number
```

<!--
But here's the problem - what happens when we divide by zero? We get Infinity, which is technically a valid number, but probably not what we expected. TypeScript can't help us here because the types are correct.
-->

---

# We throw errors... but they're unknown

```ts twoslash
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // `error` is unknown - no type safety!
}
```

<!--
So we throw errors and catch them. But here's the crucial issue - the error is typed as unknown. We have no type safety for our errors. We don't know what kinds of errors this function might throw just by looking at its signature.
-->

---
layout: section
---

# The real problem

<div v-click class="text-2xl opacity-90">
**No type safety for errors**
</div>

<!--
This is the core issue we're trying to solve. TypeScript gives us amazing type safety for success cases, but leaves us in the dark when it comes to errors.
-->

---

# Real-world complexity

```ts
const fetchPokemon = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  return mySchema.parse(data);
};
```

<!--
Let's look at a real example. This simple function looks clean, but it hides multiple failure points. The fetch can fail due to network issues, the response might not be ok, JSON parsing can throw, and schema validation can fail. Each of these has different error types and different recovery strategies.
-->

---

# What can actually go wrong?

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  // TypeError: Failed to fetch
  
  if (!response.ok) {
    // HTTP 404, 500, etc.
  }
  
  const data = await response.json();
  // SyntaxError: Invalid JSON
  
  const result = mySchema.parse(data);
  // ValidationError: Invalid schema
} catch (error) {
  // Which error is this? 🤷‍♂️
}
```

<!--
When we properly handle all these cases, we see the complexity. We have network errors, HTTP errors, JSON parsing errors, and validation errors. But in our catch block, we have no idea which specific error occurred. This makes proper error handling and user experience very difficult.
-->

---
layout: section
---

# Enter Effect

<div v-click class="text-2xl opacity-90">
**Type-safe error handling for TypeScript**
</div>

<!--
This is where Effect-TS comes in. Effect is a powerful TypeScript library that brings type safety to error handling, making the impossible states impossible to represent.
-->

---

# The Effect type

```ts
//   Success      Error          Context
//      ↓           ↓               ↓
Effect<Data,    ErrorType,    Requirements>

// Examples:
Effect<number, never>                    // Always succeeds with number
Effect<User, DatabaseError>              // User or DatabaseError  
Effect<Data, NetworkError | ParseError>  // Multiple possible errors
```

<!--
The Effect type represents a computation that can either succeed with a value of type Success, or fail with an error of type Error. This is similar to Result types in other languages, but much more powerful. The key insight is that errors are now part of the type signature.
-->

---

# Creating Effects

```ts twoslash
import { Effect, Data } from "effect";

class DivisionByZeroError extends Data.TaggedError("DivisionByZeroError") {}

function divide(a: number, b: number): Effect.Effect<number, DivisionByZeroError> {
  if (b === 0) {
    return Effect.fail(new DivisionByZeroError());
  }
  return Effect.succeed(a / b);
}

// The type tells us everything: Effect<number, DivisionByZeroError>
```

<!--
Here's how we rewrite our divide function with Effect. Instead of throwing, we return Effect.fail or Effect.succeed. The key difference is that the error type is now part of the function signature. Just by looking at the type, we know this function can fail with DivisionByZeroError.
-->

---

# Composing Effects

````md magic-move
```ts
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class ParseError extends Data.TaggedError("ParseError") {}

const fetchUser = (): Effect.Effect<Response, NetworkError> => {
  return Effect.tryPromise({
    try: () => fetch("/api/user"),
    catch: () => new NetworkError()
  });
};

const parseJson = (response: Response): Effect.Effect<User, ParseError> => {
  return Effect.tryPromise({
    try: () => response.json(),
    catch: () => new ParseError()
  });
};
```

```ts
// Composition with generators - looks like async/await!
const program = Effect.gen(function* () {
  const response = yield* fetchUser();
  const user = yield* parseJson(response);
  return user;
});

// Type: Effect<User, NetworkError | ParseError>
```
````

<!--
When we compose Effects together, the error types automatically union. This program can fail with either NetworkError or ParseError, and TypeScript knows about both. The generator syntax makes it look just like async/await, but with full error type safety.
-->

---

# Handling errors with precision

```ts twoslash
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class ParseError extends Data.TaggedError("ParseError") {}

declare const program: Effect.Effect<User, NetworkError | ParseError>;
type User = { name: string };

// ---cut-before---
const handled = program.pipe(
  Effect.catchTags({
    NetworkError: () => Effect.succeed({ name: "Guest User" }),
    ParseError: () => Effect.succeed({ name: "Unknown User" }),
  })
);

// Type: Effect<User, never> - all errors handled!
```

<!--
Now comes the beautiful part - error handling. With catchTags, we can handle each error type differently. TypeScript gives us autocomplete for the error types and ensures we handle all cases. After handling all errors, the type becomes Effect<User, never> - meaning it can't fail anymore.
-->

---

# Real-world example

```ts twoslash
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class HttpError extends Data.TaggedError("HttpError")<{ status: number }> {}
class ParseError extends Data.TaggedError("ParseError") {}

const fetchPokemon = Effect.gen(function* () {
  const response = yield* Effect.tryPromise({
    try: () => fetch("https://pokeapi.co/api/v2/pokemon/ditto"),
    catch: () => new NetworkError()
  });
  
  if (!response.ok) {
    yield* Effect.fail(new HttpError({ status: response.status }));
  }
  
  const data = yield* Effect.tryPromise({
    try: () => response.json(),
    catch: () => new ParseError()
  });
  
  return data;
});

// Type: Effect<PokemonData, NetworkError | HttpError | ParseError>
```

<!--
Here's our Pokemon example rewritten with Effect. Now we have precise error types for each failure mode. We know exactly what can go wrong and can handle each case appropriately. The function signature tells the complete story.
-->

---

# Handling different errors differently

```ts twoslash
import { Effect, Data } from "effect";

class NetworkError extends Data.TaggedError("NetworkError") {}
class HttpError extends Data.TaggedError("HttpError")<{ status: number }> {}
class ParseError extends Data.TaggedError("ParseError") {}

declare const fetchPokemon: Effect.Effect<any, NetworkError | HttpError | ParseError>;

// ---cut-before---
const robustPokemonFetch = fetchPokemon.pipe(
  Effect.catchTags({
    NetworkError: () => 
      Effect.succeed({ name: "Offline Mode", id: -1 }),
    HttpError: ({ status }) => 
      status === 404 
        ? Effect.succeed({ name: "Not Found", id: 0 })
        : Effect.fail(new Error(`Server error: ${status}`)),
    ParseError: () => 
      Effect.succeed({ name: "Invalid Data", id: -2 }),
  })
);
```

<!--
Now we can handle each error type with the appropriate recovery strategy. Network errors might show cached data, 404 errors might show a "not found" message, and parse errors might show default data. Each error type gets the treatment it deserves.
-->

---
layout: two-cols
---

## Before Effect

```ts
try {
  const result = await complexOperation();
  // What errors can happen? 🤷‍♂️
  // Have to read the implementation
  // Generic error handling
} catch (error) {
  console.error("Something went wrong");
  // Hope for the best
}

```

::right::

## With Effect

```ts twoslash
import {Effect, Data} from "effect"
class NetworkError extends Data.TaggedError("NetworkError") {}
class ValidationError extends Data.TaggedError("ValidationError") {}
type MyResult = Array<{id: string, name: string }>
declare const complexOperation: () => Effect.Effect<MyResult, NetworkError | ValidationError>;
declare const handleValidation: () => Effect.Effect<{error: "could not validate user"}>;
declare const handleNetwork: () => Effect.Effect<{error: "network failed"}>;

// ---cut-before---
const result = complexOperation();
// Type tells us all possible errors
// Effect<MyResult, NetworkError | ValidationError>

const handled = result.pipe(
  Effect.catchTags({
    NetworkError: handleNetwork,
    ValidationError: handleValidation,
  })
);
// Precise, type-safe error handling
```

<!--
This shows the fundamental difference. Without Effect, we're flying blind - we don't know what errors can occur without reading the implementation. With Effect, the type signature tells us everything, and we can handle each error precisely.
-->

---
layout: center
---

# **Collect** errors in types,<br>**handle** them with precision

<!--
This is the core philosophy of Effect - we collect all possible errors in the type system, then handle them with surgical precision where it makes sense.
-->

---

# Success story: Vercel

<img src="/tweet-1898590282020450681-no-image.png" alt="Vercel tweet about domain renewal errors" class="mx-auto h-96">

<!--
At Vercel, they had a domain auto-renewal feature that was failing unpredictably. By using Effect-style error handling, they identified 16 distinct error types instead of generic failures. This allowed them to handle each case appropriately and dramatically improve reliability.
-->

---
layout: section
---

# TypeScript is amazing

<div class="text-2xl opacity-90">
For the happy path
</div>

<!--
So yes, TypeScript is amazing for the happy path...
-->

---
layout: section
---

# Effect-TS makes errors

<div class="text-2xl opacity-90">
**Part of the happy path**
</div>

<!--
But Effect makes errors part of the happy path. You write your code naturally, collect errors in types, and handle them precisely where it matters.
-->

---
layout: center
---

# Key takeaways

<v-clicks>

- **Errors should be part of your type signature**
- **Write code like the happy path, handle errors separately**  
- **Different errors need different handling strategies**
- **The type system can guide your error handling**

</v-clicks>

<!--
Here are the key points to remember: First, errors should be part of your type signature, not hidden surprises. Second, you can write your business logic focusing on the happy path, then handle errors separately. Third, different errors often need completely different handling strategies. And finally, the type system should guide and help your error handling, not fight against it.
-->

---
layout: intro
class: text-center pb-5
glowX: 50
glowY: 120
---

# Thank you!

**Try Effect-TS:** [effect.website](https://effect.website)

**Slides & more:** [nirtamir.com](https://nirtamir.com)

<!--
Thank you! I encourage you to try Effect-TS in your next project. You can find comprehensive documentation at effect.website, and these slides along with more resources are available at nirtamir.com. Let's eliminate surprises from our TypeScript code together!
-->