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
This talk will change the way you think about handling errors in TypeScript.
We'll explore the Effect library - and see how it brings errors into the type system.
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
My name is Nir Tamir.
I've been doing frontend for over a decade.
You can find more about me at nirtamir.com.
-->

---
layout: section
---

# TypeScript is great

<!--
TypeScript is great - It helps us catch errors before they happen.
Let's see how.
-->

---
transition: view-transition
---

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}
// ---cut-before---
const result = divide("hi", 2);
```

<!--
If a function expects a number and we pass a string, TypeScript catches it immediately.
Compile-time safety. Beautiful.
-->

---

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}
// ---cut-before---
const result = divide(1, 2); // number
```

 <img src="/result-number.png" v-drag="[92,128,67,68]" />

<!--
And when we fix it, TypeScript infers the return type automatically.
This makes composition easy and refactoring safe.
-->

---
transition: view-transition
---

# But... edge cases

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

// ---cut-before---
const result = divide(4, 0); // Infinity
```

<img src="/result-number.png" v-drag="[92,128,67,68]" />

<!--
In real apps, we hit edge cases the type system can't catch.
Dividing by zero returns Infinity - a valid number.
TypeScript accepts it, but it's probably not what we want.
This is where the guarantees start breaking down.
-->

---

# The unknown error problem

```ts twoslash
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}
// ---cut-before---
try {
  const result = divide(4, 0);
} catch (error /* unknown */) {
  //
  //
  //
  //
  // What is this? Who knows! 🤷
}
```

 <img src="/error-unknown.png" v-drag="[114,158,67,68]" />

<!--
We can throw an error and catch it.
But notice - the error is typed as unknown.
TypeScript has no idea what this error looks like.
We have to manually check its shape or just hope for the best.
-->

---

# The invisible throw problem

````md magic-move
```ts
import { doSomething } from "./doSomething";

const result = doSomething();
// Using the result...
```

```ts
import { doSomething } from "./doSomething";

const result = doSomething(); // 💥 throws Error("Unexpected")
// We never see this line
```
````

<!--
Here's an even bigger problem.
[click]
This function throws an error, but TypeScript doesn't tell us.
There's no "throws" annotation in TypeScript.
We have to read the implementation or just find out at runtime.
In production. With real users.
-->

---

# Real example: fetch

```ts
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// What can fail here?
```

<v-click>

```ts
// Network error? Server down? Rate limit?
// Auth failure? Timeout? Invalid JSON?
// 404? 500?
// We have no idea! 🤷
```

</v-click>

<!--
Let's look at something we write every day.
A simple fetch request.
What can go wrong here?

[click]

Network errors, server errors, rate limits, auth failures, timeouts, invalid JSON...
At least 6-7 different failure modes.
But the type signature tells us nothing.
We just hope it works and add a generic try-catch if we remember.

[PAUSE - let this sink in]
-->

---
layout: section
---

# TypeScript is great

<div class="text-2xl">
For the happy path
</div>

<!--
So TypeScript is great - for the happy path.
When everything goes right, the types guide us perfectly.
But when things go wrong? We're flying blind.

[PAUSE]
-->

---
layout: section
---

# What we're missing

<v-click>

## Errors in the type system

</v-click>

<!--
What we really need is a way to make errors part of the type system.
[click]
So the compiler can help us handle them, just like it helps us with success values.
That's where Effect comes in.
-->

---
layout: section
---

# [Effect](https://effect.website/docs/getting-started/introduction/)

<div class="text-2xl">
A TypeScript library that puts errors in your types
</div>

<!--
Effect is a powerful TypeScript library that brings errors into your type system.
It makes every possible failure explicit and gives you tools to handle them elegantly.
-->

---

# The Effect type

```ts twoslash
// ---cut-before---
import type { Effect } from "effect";

type Success = number;
type Requirements = never;

//                                    ┌─── ✅ Success value
//                                    │
//                                    │       ┌─── 🚨 Possible errors
//                                    │       │
//                                    │       │         ┌─── 📦 Dependencies needed
//                                    ▼       ▼         ▼
type ProgramEffect = Effect.Effect<Success, Error, Requirements>;
```

<!--
The Effect type has three parts:
Success - what value we get when things work
Error - what can go wrong
Requirements - what dependencies we need

This makes every possible outcome explicit.
No hidden behaviors, no surprises.
-->

---

# Effects are blueprints

```ts twoslash
import { Effect } from "effect";

// ---cut-before---

const program = Effect.succeed(42);
// This doesn't run anything yet!
// It's a blueprint - a recipe - not a cooked meal

const result = Effect.runSync(program);
// NOW it runs and we get 42
```

<!--
This is crucial to understand.
An Effect is like a recipe card - it describes what to do, but doesn't do it.
When you create an Effect, nothing happens yet.
Only when you "run" it does it execute.

This separation lets us compose, transform, and handle errors
before anything actually runs.

[PAUSE]
-->

---

# Before Effect

```ts
async function program() {
  const data = await fetchData(); // might throw
  const parsed = parseData(data); // might throw
  return saveData(parsed); // might throw
}

// What can go wrong? Nobody knows! 🤷
```

<!--
Here's typical TypeScript.
Three operations, each might fail, but the function signature doesn't tell us anything.
We have to read the implementation, hope for documentation, or just cross our fingers.
-->

---

# After Effect

```ts {all|1|3-7|all}
const program =  Effect.gen(function* () {
    const data = yield* fetchData(); // Effect<Data, FetchError>
    const parsed = yield* parseData(data); // Effect<Parsed, ParseError>
    return yield* saveData(parsed); // Effect<Data, SaveError>
  });
}

// The type tells us EXACTLY what can fail ✅
```

<!--
With Effect, the function signature tells the complete story.
[click]
Every possible error is tracked in the type: FetchError, ParseError, SaveError.

[click]
Inside Effect.gen, we write almost like normal code.
yield* unwraps the Effect and gives us the value
If any step fails, the error propagates automatically
The compiler knows about all of them

[click]
No surprises, no hidden failures.
This is the key difference.

[PAUSE - this is important]
-->

---

# What does yield\* do?

```ts {all|3|4|5|all}
const program = Effect.gen(function* () {
  // yield* unwraps Effects and gives you the value
  const data = yield* fetchData(); // Gets the actual Data
  const parsed = yield* parseData(data); // Gets the Parsed value
  return yield* saveData(parsed); // Gets the final result

  // If any step fails, the error bubbles up automatically
  // The type system tracks all possible errors
});
```

<!--
Let me clarify what yield* does - it's important.

[click]
When you yield* an Effect, it unwraps it and gives you the success value.
[click]
So you can use it like a normal variable.
[click]
Each yield* gets the value from that Effect.

[click]
But here's the magic: if any Effect fails, the error bubbles up automatically.
You don't write try-catch everywhere.
The errors just accumulate in the type signature.

Think of yield* like await, but it also tracks errors in types.
-->

---

# A Real Example

```ts {all|3|5-7|9-14|all}
import { Data, Effect } from "effect";

class DivideByZeroError extends Data.TaggedError("DivideByZeroError")<{}> {}

//      ┌─── Effect<number, DivideByZeroError, never>
//      ▼
const program = Effect.gen(function* () {
const random = 
  if (b === 0) {
    return yield* Effect.fail(new DivideByZeroError());
  }
  return a / b;
});
```

<!--
Let's build something real with what we learned.

[click]
First, we define a custom error type. This is a tagged error that Effect can recognize.

[click]
The return type tells us everything: we get a number on success, or DivideByZeroError on failure.

[click]
Inside Effect.gen, we check for division by zero.
If b is zero, we yield* Effect.fail with our typed error.
yield* here propagates the error up.
Otherwise, we return the result.

[click]
Now the function signature is honest.
It tells us exactly what can happen.
No surprises.
-->

---

# Handling Errors - The Problem

```ts
const result = Effect.runSync(program);
// 💥 throws DivideByZeroError
```

<!--
If we run this Effect directly, it can throw.
We're back to the same problem - an unhandled error at runtime.
But now we KNOW it's there because the type told us.
The compiler is warning us.
-->

---

# Handling Errors - The Solution

```ts {all|1-4|6-7|all}
const safeProgram = program.pipe(
  Effect.catchTag(
    "DivideByZeroError",
    () => Effect.succeed(Infinity), // Return Infinity like JavaScript does
  ),
); // Effect<number, never, never>

const result = Effect.runSync(safeProgram);
// Infinity - Safe! ✅
```

<!--
Here's where Effect shines.

[click]
We use catchTag to handle specific errors by their tag.
TypeScript autocompletes "DivideByZeroError" because it's in the type.
When it happens, we recover by returning Infinity - just like JavaScript's default behavior.
But now it's explicit and intentional.

[click]
Look at the new type: Effect<number, never, never>
The error is GONE. We handled it completely.
Now when we run it, it's guaranteed to succeed.

[click]
This is the key insight: we decide WHEN and WHERE to handle errors.
And the type system keeps perfect track of what's handled and what's not.

[PAUSE - let this land]
-->

---

# The type guides us

````md magic-move
```ts
const program: Effect<number, DivideByZeroError, never>
// Compiler: "Hey! You have an unhandled error!"
```

```ts
const recovered: Effect<number, never, never>
// Compiler: "All good! No errors left!"
```
````

<!--
This is the superpower Effect gives us.

Before we handle the error, the compiler tells us it's there.
[click]
After we handle it, the type changes to "never" - meaning no errors remain.

The type system is our guide.
It won't let us forget about errors.
-->

---

# Multiple Errors

```ts {all|3-4|6-8|10-15|all}
import { Data, Effect } from "effect";

class NetworkError extends Data.TaggedError("NetworkError")<{}> {}
class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<User, NetworkError | ValidationError, never>
//      ▼
const program = Effect.gen(function* () {
  const user = { id: "123", name: "Alice" };

  // These are Effect-returning functions
  yield* validateUser(user); // might fail with ValidationError
  return yield* sendToServer(user); // might fail with NetworkError
});
```

<!--
Real programs have multiple failure modes.

[click]
We might have network errors, validation errors, database errors, and so on.

[click]
When we compose Effects, the errors accumulate in the type.
NetworkError OR ValidationError - both are tracked.

[click]
Each yield* might introduce a new error type.
The compiler collects them all.

[click]
Every possible failure is visible.
No hidden surprises.
-->

---

# Handling Multiple Errors

```ts {all|1-6|8-9|all}
const safeProgram = program.pipe(
  Effect.catchTags({
    NetworkError: () => Effect.succeed(cachedUser),
    ValidationError: (error) => Effect.fail(new BadRequestError(error)),
  }),
); // Effect<User, BadRequestError, never>

const result = Effect.runSync(safeProgram);
// NetworkError and ValidationError are gone! ✅
```

<!--
We can handle multiple errors at once with catchTags.

[click]
For NetworkError, we fall back to a cached user.
For ValidationError, we transform it into a different error type.

This is powerful - we can recover from some errors and transform others.
The type system tracks everything.

[click]
After handling, NetworkError and ValidationError are gone from the type.
We're left with only BadRequestError.
The type guides us to handle what's left.

[click]
We can't forget or ignore errors - they're right there in the signature.
The compiler won't let us.
-->

---
layout: center
---

# We can use the type system to track **errors**, not only **success** values

<!--
This is the core insight.

TypeScript already tracks success values beautifully.
Effect extends that same power to errors.

[PAUSE - this is the thesis of the talk]
-->

---
layout: center
---

![generic error meme](./generic-error-meme.png){.h-50}

<!--
This is what we're trying to avoid.
Generic errors that tell us nothing.
They hide the real problem and make debugging impossible.

[PAUSE]

Effect makes every error specific and actionable.
-->

---

# Real World Impact

<div class="grid grid-cols-2 gap-8">

<div>

## Before

```ts
type RenewDomainError =
  | ApiError
  | StripePaymentError
  | StripePaymentMethodError;
```

Generic errors - tells us nothing useful

</div>

<div>

## After

```ts
type RenewDomainError =
  | CustomerIdNotFoundError
  | DomainsMutexError
  | DraftInvoiceError
  | ExpirationDateOutOfRangeError
  | GetDomainInvoiceError
  | InvalidDomainStatusError
  | PayInvoiceError
  | RefundDomainInvoiceError
  | RenewFailureError
  | SyncDomainError
  | TLDConfigNotFoundError
  | UpdateVercelDomainError;
// ... 5 more
```

Specific errors - each one actionable

</div>

</div>

<!--
Here's a real example from Vercel.
They had a feature for auto-renewing domains with mysterious failures.
Three generic error types told them almost nothing.

After adopting Effect and similar patterns, the error count jumped to 17 specific types.

[PAUSE]

That sounds worse, but it's actually great.
They weren't hiding problems anymore - they could see exactly what was failing.
Each error type points to a specific problem they can fix.

More errors, fewer problems.

[PAUSE - let the paradox sink in]
-->

---
layout: center
---

# More Errors = Fewer Problems

<!--
This might seem counterintuitive, but it's true.
When you can see all the errors, you can handle them properly.
Generic errors hide problems. 
Specific errors reveal solutions.
-->

---

# Beyond Error Handling: Retries

```ts
const withRetry = fetchUser(id).pipe(
  Effect.retry(Schedule.exponential("100 millis")),
);
```

<SlidevVideo autoreset="click" autoplay v-click controls>
  <source src="/effect-exponential-retry-only.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/effect-exponential-retry-only.mov">here</a>.
  </p>
</SlidevVideo>

<!--
Once errors are in the type system, you can compose them safely.
Effect gives you powerful tools that work with typed errors.

For example, retry with exponential backoff.
Each retry waits longer than the last.

[click]
The video shows how it backs off over time.
This is all type-safe - Effect knows what errors can happen at each step.
-->

---

# Beyond Error Handling: Timeouts

```ts
const withTimeout = fetchUser(id).pipe(Effect.timeout("5 seconds"));
```

<SlidevVideo autoreset="click" autoplay v-click controls>
  <source src="/effect-timeout.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/effect-timeout.mov">here</a>.
  </p>
</SlidevVideo>

<!--
You can add timeouts to any Effect.
If it takes too long, it fails with a TimeoutError.

[click]
The video shows the effect timing out after the limit.
And again - the timeout error is tracked in the type system.
-->

---

# Composing it all

```ts
const robust = fetchUser(id).pipe(
  Effect.retry(Schedule.exponential("100 millis")),
  Effect.timeout("5 seconds"),
  Effect.catchTags({
    TimeoutError: () => Effect.succeed(cachedUser),
    NetworkError: () => Effect.fail(new ServiceUnavailable()),
  }),
);
```

<!--
The beautiful part is you can compose all these patterns together.
Retry with backoff, add a timeout, handle specific errors.

Each transformation is type-safe.
The compiler tracks what errors remain after each step.

This is what Effect enables - safe, composable error handling.
-->

---
layout: section
---

# Key Takeaways

<v-clicks>

1. **TypeScript is great for the happy path**
2. **But errors are invisible in normal TypeScript**
3. **Effect puts errors in your types**
4. **The compiler guides you to handle them**
5. **More specific errors = fewer problems**

</v-clicks>

<!--
Let's recap what we've learned.

[click]
TypeScript gives us amazing safety for successful operations.

[click]
But when things fail, we lose that safety. Errors are invisible and untyped.

[click]
Effect brings errors into the type system, making them visible and trackable.

[click]
The compiler becomes your guide - it won't let you ignore errors.
You decide when and how to handle them, but you can't forget them.

[click]
And paradoxically, having more specific errors makes your code more reliable.
Because you can see and handle each failure mode appropriately.

[PAUSE - let them absorb this]
-->

---
layout: section
---

# Errors in the type system = The compiler helps you

<!--
This is the philosophy of Effect.

It's not just about awareness - it's about getting the same help from the compiler
for error cases that you already get for success cases.

The type system becomes your safety net for everything, not just the happy path.

[PAUSE]
-->

---
layout: intro
class: text-center pb-5
glowX: 50
glowY: 120
---

<h1 text-4xl>
Thank you!
</h1>

<div class="mt-8">
<p>Slides: <b>nirtamir.com</b></p>
<p>Effect: <b>effect.website</b></p>
</div>

<div class="mt-8 text-sm opacity-75">
<p>Questions? Find me after or at nirtamir.com</p>
</div>

<!--
Thank you for your time!
The slides are available at nirtamir.com
And I highly recommend checking out effect.website - the docs are excellent.
I'm happy to answer questions after the talk or you can reach me through my website.
-->

---
title: Resources
---

# Learn More

**Effect Resources**

- [Effect website](https://www.effect.website) - Official docs and guides
- [Effect: Beginners Complete Getting Started](https://www.typeonce.dev/course/effect-beginners-complete-getting-started) - Free course

**Videos**

- [The Simple Secret Behind Effect's Power](https://youtu.be/F5aWLtEdNjE)
- [Effect: the unreadable library that captured my heart](https://youtu.be/S2GChOwivwQ)
- [Dillon Mulroy - More errors, fewer problems](https://www.youtube.com/watch?v=VcOIz7tOBoM) - The Vercel talk

**Community**

- [Effect Discord](https://discord.gg/effect-ts) - Very active and helpful community
