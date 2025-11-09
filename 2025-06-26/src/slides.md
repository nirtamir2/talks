---
highlighter: shiki
css: unocss
colorSchema: dark
transition: fade-out
mdc: true
layout: center
glowSeed: 4
lang: en-US
title: "TypeScript Without Surprises: Smarter Error Handling with Effect"
---

![](./nirtamir-animate.svg){.w-30.mt--10.mb-5}

<!--
TypeScript Without Surprises: Smarter Error Handling with Effect
-->

---
layout: center
---

# TypeScript Without Surprises: Smarter Error Handling with Effect

<!--
This talk will change the way you think about handling errors in TypeScript.
We'll explore the Effect library - and see how it solves problems you might not even realize you have.
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

```ts
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

```ts
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
import { makeCoffee } from "./makeCoffee";

const coffee = makeCoffee();
```

```ts
import { makeCoffee } from "./makeCoffee";

const coffee = makeCoffee(); // 💥 throws Error("MachineOutOfWaterError ☕️")
```
````

<!--
Here's an even bigger problem.
[click]
This function throws an error, but TypeScript doesn't tell us.
There's no "throws" annotation in TypeScript.
We have to read the implementation or just find out at runtime.
In production.
-->

---
hide: true
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

# Error handling in TypeScript

<!--
So how we handle errors in TypeScript?
-->

---

# We need to check the error types ourselves

```ts
class CustomError extends Error {
  _tag = "CustomError";
}
```

<v-click>

````md magic-move
```ts
function doSomething() {
  if (Math.random() > 0.9) {
    throw new CustomError();
  }
  return "✅";
}
```

```ts {3}
function doSomething() {
  if (Math.random() > 0.9) {
    throw new CustomError();
  }
  return "✅";
}
```
````

</v-click>

<v-click>

````md magic-move
```ts
try {
  const result = doSomething(); // throws CustomError()
} catch (error /* unknown */) {
  if (error instanceof CustomError) {
    console.error(error);
  }
}
```

```ts {4}
try {
  const result = doSomething(); // throws CustomError()
} catch (error /* unknown */) {
  if (error instanceof CustomError) {
    console.error(error);
  }
}
```
````

</v-click>

<!--
One option is to define a custom error that extends error.
[click]
[click]
This lets us throw a specific type of error instead of a generic one.
[click]
That way, we can check the type inside the catch block and handle it accordingly.
[click]
it’s still typed as unknown, so we need a type guard like instanceof.
This works, but it’s manual and easy to forget or get wrong.
-->

---

# Errors as Values

```ts
type Result<Data, Error> =
  | { data: Data; error: never }
  | { data: never; error: Error };
```

<v-click>

````md magic-move
```ts
function doSomething(): Result<string, CustomError> {
  if (Math.random() > 0.9) {
    return { error: new CustomError() };
  }
  return { data: "✅" };
}
```
````

</v-click>

<v-click>

````md magic-move
```ts
const result = doSomething();

if (result.error == null) {
  console.log(result.data); // string
} else {
  console.error(result.error); // CustomError
}
```
````

</v-click>

<!--
In languages like Go, there’s no concept of throwing errors — you return them instead.
We can do something similar in TypeScript.
[click]
Here, the Result type makes sure we either get data or error, but not both.

[click]
TypeScript even infers the structure for us, so we can easily pattern match or check which case we’re in.
And the nice part is, it makes the function’s possible errors explicit in the type system.
But — and it’s a big but — it’s verbose.
-->

---

# Wrapping and Unwrapping Gets Messy

```ts twoslash
type Result<Data, Error> =
  | { data: Data; error: never }
  | { data: never; error: Error };

class StepOneError extends Error {
  _tag = "StepOneError";
}
class StepTwoError extends Error {
  _tag = "StepTwoError";
}
class StepThreeError extends Error {
  _tag = "StepThreeError";
}
class StepFourError extends Error {
  _tag = "StepFourError";
}

function stepOne(a: number): Result<number, CannotDivideByZeroError> {
  if (a === 0) {
    return { error: new StepOneError() };
  }
  return { data: a };
}
function stepTwo(a: number): Result<number, CannotDivideByZeroError> {
  if (a === 0) {
    return { error: new StepTwoError() };
  }
  return { data: a };
}
function stepThree(a: number): Result<number, CannotDivideByZeroError> {
  if (a === 0) {
    return { error: new StepThreeError() };
  }
  return { data: a };
}
function stepFour(a: number): Result<number, CannotDivideByZeroError> {
  if (a === 0) {
    return { error: new StepFourError() };
  }
  return { data: a };
}

type DoSomethingResult = Result<number | StepOneError | StepTwoError>;

// ---cut-before---
function doSomething(): DoSomethingResult {
  const a = stepOne(1);
  if (a.error != null) {
    return a;
  }

  const b = stepTwo(a.data);
  if (b.error != null) {
    return b;
  }

  return b.data;
}
```

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click="[1]" v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 120, height:60 }"  />

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click="[1]" v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 213, height:60 }"  />

<!--
[click]
Composing multiple such functions gets messy, since we now have to wrap and unwrap manually all the way through.
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
is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.</div>

<!--
Effect is a powerful TypeScript library that brings errors into your type system.
It makes every possible failure explicit and gives you tools to handle them elegantly.
-->

---

# The Effect type

```ts
import type { Effect } from "effect";

//               ✅      🚨        📦
//
//               ▼       ▼         ▼
Effect.Effect<Success, Error, Requirements>;
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

# Effect Values

```ts
import { Effect } from "effect";

const value = Effect.succeed(42); // Effect.Effect<number, never, never>

const error = Effect.fail("Oops"); // Effect.Effect<never, string, never>
```

<!-- <img v-click=[1] src="/effect-number.png" v-drag="[71,160,226,89]" /> -->

<!-- <img v-click=[2] src="/effect-error.png" v-drag="[82,271,218,90]" /> -->

<!--
We can create effects using Effect.succeed for successful values, or Effect.fail for errors. This avoids throwing exceptions and keeps errors explicit and typed.
-->

---

# Effects are blueprints

```ts
const program = Effect.succeed(42);
// This doesn't run anything yet!

const result = Effect.runSync(program);
// NOW it runs and we get 42
```

<!--
An Effect is like a blueprint - it describes what to do, but doesn't do it.
When you create an Effect, nothing happens yet.
Only when you "run" it does it execute.

This separation lets us compose, transform, and handle errors
before anything actually runs.

[PAUSE]
-->

---

# A Real Example

```ts {all|3|7,12|8-11|5-7|all}
import { Effect, Data } from "effect";

class PaymentFailed extends Data.TaggedError("PaymentFailed")<{}> {}

//      ┌─── Effect<string, PaymentFailed, never>
//      ▼
const program = Effect.gen(function* () {
  if (Math.random() < 0.1) {
    return yield* Effect.fail(new PaymentFailed());
  }
  return "payment-1234";
});
```

<!--
Let's build something real with what we learned.

[click]
First, we define a custom error type. This is a tagged error that Effect can recognize.

[click]
Now, we define a program using `Effect.gen()`.  
It accepts a generator function, so we write `function*`.

[click]
Inside our generator function we generate a random number to simulate failure

If its below 0.1, we yield* Effect.fail with our typed error.

The 'yield*' is like 'await' - it unwraps Effect values.

When you yield* an Effect, it unwraps it and gives you the success value.

So you can use it like a normal variable.

But here's the magic: if any Effect fails, the error bubbles up automatically.
You don't write try-catch everywhere.
The errors just accumulate in the type signature.

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
// 💥 throws PaymentFailed
```

<!--
If we run this Effect directly, it can throw.
We're back to the same problem - an unhandled error at runtime.
But now we KNOW it's there because the type told us.
The compiler is warning us.
-->

---

# Handling Errors - The Solution

```ts {all|1-3|3|all}
const safeProgram = program.pipe(
  Effect.catchTag("PaymentFailed", () => Effect.succeed("On the house 💸")),
); // Effect<string, never, never>

const result = Effect.runSync(safeProgram);
// string - Safe! ✅
```

<!--
Here's where Effect shines.

[click]
We use catchTag to handle specific errors by their tag.
TypeScript autocompletes "PaymentFailed" because it's in the type.
When it happens, we recover by returning a different string value.
But now it's explicit and intentional.

[click]
Look at the new type: Effect<string, never, never>
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
// ❌ Before handling
const program: Effect<string, PaymentFailed, never>;
// Compiler says: "You have an unhandled error!"
```

```ts
// ✅ After handling  
const recovered: Effect<string, never, never>;
// Compiler says: "All good! Safe to run!"
```
````

<!--
This is the superpower Effect gives us.

Before we handle the error, the type shows it's there.
[click]
After we handle it, the error becomes 'never'—meaning zero errors remain. 

The type system won't let us forget.
-->

---

# Multiple Errors

```ts {all|3-4|6-8|10-15|all}
import { Effect, Data } from "effect";

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

```ts {all|1|2,6|3-7|all}
const program: Effect<Data, FetchError | ParseError | SaveError> = Effect.gen(function* () {
    const data = yield* fetchData(); // Effect<Data, FetchError>
    const parsed = yield* parseData(data); // Effect<Parsed, ParseError>
    return yield* saveData(parsed); // Effect<Data, SaveError>
  });

// The type tells us EXACTLY what can fail ✅
```

<!--
With Effect, the function signature tells the complete story.
[click]
Every possible error is tracked in the type: FetchError, ParseError, SaveError.

[click]
Inside Effect.gen, we write almost like normal code.
[click]
yield* unwraps the Effect and gives us the value
If any step fails, the error propagates automatically
The compiler knows about all of them

[click]
No surprises, no hidden failures.
This is the key difference.

[PAUSE - this is important]
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

![generic error meme](./generic-error-meme.png){.h-80}

<!--
This is what we're trying to avoid.
Generic errors that tell us nothing.
They hide the real problem and make debugging impossible.

[PAUSE]

Effect makes every error specific and actionable.
-->

---
layout: section
---

# From error tracking to recovery

<div v-click class="text-2xl">
We can recover, retry, and compose effects in many ways
</div>

<!--
Up until now, we’ve been tracking errors.

We saw how the type system keeps a full record of all possible failures —
which ones happen, which ones remain after we recover.

But tracking is just the beginning.

[click]

Once we know what can fail, we can start composing workflows in all sorts of ways:
retrying operations, repeating effects, scheduling tasks, and more.

Let’s take a look at that next with few examples.
-->

---

# Beyond Error Handling: Timeouts

Add a time limit to an effect, failing with timeout if exceeded

```ts
const pizza = orderDelivery();
const result = Effect.timeout(pizza, "1 second");
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

We have orderDelivery() and we don’t want to wait forever.
Using Effect.timeout(pizza, "1 second"), the effect fails if it takes too long — the pizza gets cold.


[click]
After one second, it fails automatically with a timeout.
-->

---

# Beyond Error Handling: Retries

Run an effect repeatedly until it succeeds, ignoring errors

```ts
const swipeCard = swipeCard();
const result = Effect.eventually(swipeCard);
```

<SlidevVideo autoreset="click" autoplay v-click controls>
  <source src="/effect-eventually.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/effect-eventually.mov">here</a>.
  </p>
</SlidevVideo>

<!--
swipeCard() might fail temporarily.
With Effect.eventually(swipeCard), it keeps retrying until it succeeds, ignoring errors.

[click]
Each attempt runs automatically until the card is accepted.
-->

---

# Effect.retry recurs

Retry an effect a fixed number of times

```ts
const wakeUp = attemptToWakeUp();
const snoozeSchedule = Schedule.intersect(
  Schedule.spaced("2 seconds"),
  Schedule.recurs(4),
);
const result = Effect.retry(wakeUp, snoozeSchedule);
```

<SlidevVideo autoreset="click" autoplay v-click controls>
  <source src="/effect-retry-only.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/effect-retry-only.mov">here</a>.
  </p>
</SlidevVideo>

<!--
We try to attemptToWakeUp() on a schedule: every 2 seconds, up to 4 times.
Using Effect.retry(wakeUp, snoozeSchedule), the effect retries according to the schedule.

[click]
It stops once it succeeds or reaches the limit.
-->

---

# Effect.retry exponential

Retry with exponential backoff

```ts
const park = attemptParallelPark();
const result = Effect.retry(park, Schedule.exponential("700 millis"));
```

<SlidevVideo autoreset="click" autoplay v-click controls>
  <source src="/effect-exponential-retry-only.mov" type="video/mp4" />
  <p>
    Your browser does not support videos. You may download it
    <a href="/effect-exponential-retry-only.mov">here</a>.
  </p>
</SlidevVideo>

<!--
For attemptParallelPark(), we retry with exponential backoff: Effect.retry(park, Schedule.exponential("700 millis")).

[click]
Each retry waits longer than the last, reducing pressure and avoiding too-frequent attempts.
-->

---
layout: two-cols-header
---

# More errors - fewer problems

::left::

![tweet-dillon](/tweet-1898590282020450681-no-image.png)

<div class="flex gap-4 flew-wrap">

[<mdi-twitter /> Source](https://x.com/dillon_mulroy/status/1898590282020450681)

[<mdi-youtube /> Talk](https://www.youtube.com/watch?v=VcOIz7tOBoM)

</div>

::right::

````md magic-move
```ts
type RenewDomainError =
  | ApiError
  | StripePaymentError
  | StripePaymentMethodError;
```

```ts
type RenewDomainError =
  | CannotRenewError
  | CustomerIdNotFoundError
  | DomainsMutexError
  | DraftInvoiceError
  | ExpirationDateOutOfRangeError
  | GetDomainInvoiceError
  | GetDomainPriceError
  | GetUpstreamRegistrarDomainError
  | InvalidDomainStatusError
  | UpstreamRegistrarDomainNotFoundError
  | UpstreamRegistrarRenewDomainError
  | PayInvoiceError
  | RefundDomainInvoiceError
  | RenewFailureError
  | SyncDomainError
  | TLDConfigNotFoundError
  | UpdateVercelDomainError;
```
````

<!--
At Vercel, they had a feature for auto-renewing domains — and lots of mysterious issues.
After switching to Effect and similar concepts, suddenly the error count jumped — from 3 [click] to 17. 
But that was actually good news — it meant they weren’t hiding problems anymore.
They could finally see what was really happening.


It becomes much easier to find the root cause of an error instead of just seeing a generic one — and since it’s still TypeScript, it doesn’t force us into a new ecosystem.

Effect might look different at first, with its generators and yield, but it fits naturally once you get used to it.
The key idea is: you don’t have to handle errors immediately — just make sure you’re aware of them and don’t ignore them.
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
hide: true
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

- [Effect Discord](https://discord.gg/effect) - Very active and helpful community
