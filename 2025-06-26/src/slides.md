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
This talk will hopefully change the way you think about handling errors in TypeScript.
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
<!-- - <mdi-github /> [@nirtamir2](https://github.com/nirtamir2) -->
- <mdi-twitter /> [@NirTamir](https://twitter.com/NirTamir)
<!-- - <mdi-linkedin /> [@nirtamir2](https://linkedin.com/in/nirtamir2) -->

<!--
My name is Nir. Tamir.
I've been doing frontend for over a decade.
You can find more about me at nirtamir.com.
-->

---
layout: section
---

# TypeScript is great

<!--
TypeScript is great - It helps us catch errors before they happen.
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
If a function expects a number and we pass a string, we get compile time error.
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

 <img src="/result-number.png" v-drag="[99,130,93,85]" />

<!--
And when we fix it, TypeScript infers the return type automatically.
This makes composition easy and refactoring safe.
-->

---
transition: view-transition
---

# When the type system can't help

```ts
const result = divide(4, 0); // Infinity
```

<img src="/result-number.png" v-drag="[103,130,91,83]" />

<!--
In real apps, we hit edge cases the type system can't catch.
Dividing by zero, for example, returns Infinity.
Its a valid number - so TypeScript accepts it - but it's probably not what we want.
-->

---

# Errors are typed as 'unknown'

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

 <img src="/error-unknown.png" v-drag="[125,180,102,94]" />

<!--
We can throw an error and catch it.
But notice - the error is typed as unknown.
TypeScript has no idea what this error looks like.
We have to manually check its shape.
-->

---
clicks: 2
---

# The invisible throw problem

````md magic-move
```ts
import { makeCoffee } from "./makeCoffee";

const coffee = makeCoffee();
```

```ts
import { makeCoffee } from "./makeCoffee";

const coffee = makeCoffee(); // returns Coffee accepts no parameters
```

```ts
import { makeCoffee } from "./makeCoffee";

const coffee = makeCoffee(); // 💥 throws Error("MachineOutOfWaterError ☕️")
```
````

 <img src="/make-coffee-type.png" v-click="[1,3]" v-drag="[186,178,160,99]" />

<!--
Here's an even bigger problem.
Look at this function.
[click] 
TypeScript tells us what parameters this function needs and how to call it.
[click]
But this function throws an error - and TypeScript doesn't tell us

There's no "throws" annotation in TypeScript.
We have to read the implementation or just find out at runtime.
In production.
-->

---
layout: section
---

# How do you handle an error you can't see?

<div class="text-2xl">
We're back to the JavaScript days
</div>

<!--
Think about it for a moment.

If a function doesn't tell you what can go wrong,
how do you write proper error handling?

Do you wrap everything in try-catch and return a generic error?

This reminds me of the days of JavaScript before TypeScript.
Remember that world?

You couldn’t trust function parameters or return values.
You had to dig into the code just to see what it returned.
And always watch out for undefined and null.

We had so many bugs — just because we didn’t know what could be null.

TypeScript solved that problem beautifully.
Now the compiler tells us exactly what a function expects — and what it returns.

But… TypeScript doesn’t tell us what errors a function can throw.

Even when we know something might fail, the catch block gives us only unknown.

So we’re back to the old JavaScript problems — but this time, with errors.

No type safety.
No compiler help.
Just runtime surprises.

We can’t handle errors well if we don’t know they exist — or what they are.
-->

---
layout: section
---

# How we handle errors today

<!--
So how we handle errors in TypeScript?
-->

---

# Custom error classes

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
One option is to define a custom error that extends error, with a custom tag.
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

# Return errors as Values

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
But it has a lot of repetitive code.
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

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click="[1]" v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 130, height:80 }"  />

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click="[1]" v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 253, height:80 }"  />

<!--
[click]
Composing multiple such functions gets messy, since we now have to wrap and unwrap manually.
-->

---

![simpsons](/simpsons-better.png){.h-120 .m-auto}

<!--
You can ask any Go developers if this looks familiar…
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
But when things go wrong? We're alone.

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
Effect is a powerful TypeScript library that brings errors into the type system.
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
-->

---

# Effect Values

```ts
import { Effect } from "effect";

const value = Effect.succeed(42); // Effect.Effect<number, never, never>

const error = Effect.fail("Oops"); // Effect.Effect<never, string, never>
```

<!--
We can create effects using Effect.succeed for successful values, or Effect.fail for errors. This avoids throwing exceptions and keeps errors explicit and typed. It looks very similar to Promise.resolve & Promise.reject.

Effect.succeed creates an effect that resolves with the number 42.
So its type is: Effect<number, never, never> —
meaning it produces a number, and it never fails or depends on anything.

Effect.fail creates an effect that fails with the string "oops".
So its type is: Effect<never, string, never>.
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
We have to call `runSync` or `runPromise` to run the effect. 

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
  if (isCreditExceeded()) {
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
If isCreditExceeded, we yield* Effect.fail with our typed error.

The yield* works just like await.
It unwraps the Effect and gives you the success value —
so you can use it like a normal variable.

But here's the magic: if any Effect fails, the error bubbles up automatically.
The errors just accumulate in the type signature.

yield* here is what propagates the error up.

Otherwise, we just return the result.

[click]
Now the function signature is honest.
It tells us exactly what can happen.
No surprises.
-->

---

# Error in the type

```ts
//                               ┌─── Effect<string, PaymentFailed, never>
//                               ▼
const result = Effect.runSync(program);
// 💥 throws PaymentFailed
```

<!--
If we run this Effect directly, it can throw.
We're back to the same problem - an unhandled error at runtime.
But now we KNOW it's there because the type told us.
-->

---

# Error handled in the type

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
The error is GONE.

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
// Compiler says: "All errors are handled!"
```
````

<!--
Before we handle the error, the type shows it's there.
[click]
After we handle it, the error becomes 'never'—meaning zero errors remain. 
-->

---

# Real programs have many failures

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
validateUser is a function my teammate wrote - I don't need to took at the implementation to see what it throws.  
Each yield may introduce a new type of error, which the compiler then collects.

[click]
Notice that the code focuses on the happy path, but every possible failure is visible.
-->

---

# Handling Multiple Errors

```ts {all|1-6|3|4|1-6|8-9|all}
const safeProgram = program.pipe(
  Effect.catchTags({
    NetworkError: () => Effect.succeed(cachedUser),
    ValidationError: (error) => Effect.fail(new BadRequestError(error)),
  }),
); // Effect<User, BadRequestError, never>

const result = Effect.runSync(safeProgram);
// NetworkError and ValidationError are handled! ✅
```

<!--
We can handle multiple errors at once with catchTags.

[click]

[click]
For NetworkError, we fall back to a cached user.
[click]
For ValidationError, we transform it into a different error type.

[click]

This is powerful - we can recover from some errors and transform others.
The type system tracks everything.

[click]
After handling, NetworkError and ValidationError are gone from the type.
We're left with only BadRequestError.

[click]
We can't forget or ignore errors - they're right there in the signature.
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

```ts {all|1,5|2-4|all}
const program = Effect.gen(function* () {
  const data = yield* fetchData(); // Effect<Data, FetchError>
  const parsed = yield* parseData(data); // Effect<Parsed, ParseError>
  return yield* saveData(parsed); // Effect<Data, SaveError>
}); // Effect<Data, FetchError | ParseError | SaveError>

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
Happy path code - with No surprises and no hidden failures.
This is the key difference.

[PAUSE - this is important]
-->

---

# The difference

Let's see what changed

````md magic-move
```ts
async function program() {
  const data = await fetchData();
  const parsed = parseData(data);
  return saveData(parsed);
}
```

```ts
const program = Effect.gen(function* () {
  const data = yield* fetchData();
  const parsed = yield* parseData(data);
  return yield* saveData(parsed);
});
```
````

<!--
Look at the difference
[click]
It's almost identical
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

![generic error meme](/generic-error-meme.png){.h-130}

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

# [Beyond Error Handling:](https://effect.kitlangton.com/) Timeouts

Add a time limit to an effect, failing with timeout if exceeded

```ts
const pizza = orderDelivery();
const result = Effect.timeout(pizza, "1 second");
```

<SlidevVideo autoreset="click" autoplay v-click>
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

# [Beyond Error Handling:](https://effect.kitlangton.com/) Retries

Run an effect repeatedly until it succeeds, ignoring errors

```ts
const swipeCard = swipeCard();
const result = Effect.eventually(swipeCard);
```

<SlidevVideo autoreset="click" autoplay v-click>
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

# [Beyond Error Handling:](https://effect.kitlangton.com/) Retry with schedules

Retry an effect a fixed number of times

```ts
const wakeUp = attemptToWakeUp();
const snoozeSchedule = Schedule.intersect(
  Schedule.spaced("2 seconds"),
  Schedule.recurs(4),
);
const result = Effect.retry(wakeUp, snoozeSchedule);
```

<SlidevVideo autoreset="click" autoplay v-click>
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

# [Beyond Error Handling:](https://effect.kitlangton.com/) Exponential backoff

Retry with exponential backoff

```ts
const park = attemptParallelPark();
const result = Effect.retry(park, Schedule.exponential("700 millis"));
```

<SlidevVideo autoreset="click" autoplay v-click>
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

# More errors - better visibility

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
After switching to Effect (and neverthrow) and similar concepts, suddenly the error count jumped — from 3 [click] to 17. 
But that was actually good news — it meant they weren’t hiding problems anymore.
They could finally see what was really happening. And when you know your errors you can decide how to handle them - by recover from them with retries mechanism, transforming them, or giving the user more context about what fails. 


It becomes much easier to find the root cause of an error instead of just seeing a generic one — and since it’s still TypeScript, it doesn’t force us into a new ecosystem.

Effect might look different at first, with its generators and yield, but it fits naturally once you get used to it.
The key idea is: you don’t have to handle errors immediately — just make sure you’re aware of them and don’t ignore them.
-->

---
layout: section
---

# Key Takeaways

<v-clicks>

- **TypeScript is great for the happy path**
- **But errors are invisible in normal TypeScript**
- **Effect makes your errors visible**
- **Specific errors = reliable code**

</v-clicks>

<!--
Let's recap what we've learned.

[click]
TypeScript gives us amazing safety for successful operations.

[click]
But when things fail, we lose that safety. Errors are invisible and untyped.

[click]
Effect brings errors into the type system, making them visible and trackable.
You can focus on the happy path and the compiler won't let you ignore errors.
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

<h1 class="text-4xl">
Thank you!
</h1>

<div class="my-4">
<p>Slides: <b><a href="https://nirtamir.com">nirtamir.com</a></b></p>
</div>

<QRCode class="m-auto w-40 mix-blend-lighten" text="https://talks.nirtamir.com/2025/node-tlv/"/>

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
- [Visual Effect](http://effect.kitlangton.com/) - Interactive effect examples

**Videos**

- [The Simple Secret Behind Effect's Power](https://youtu.be/F5aWLtEdNjE)
- [Effect: the unreadable library that captured my heart](https://youtu.be/S2GChOwivwQ)
- [Dillon Mulroy - More errors, fewer problems](https://www.youtube.com/watch?v=VcOIz7tOBoM)

**Community**

- [Effect Discord](https://discord.gg/effect-ts) - Very active and helpful community
