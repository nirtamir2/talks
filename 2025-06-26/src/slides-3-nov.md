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
layout: section
---

# TypeScript is great

<div class="text-2xl">
For the happy path
</div>

<!--
So TypeScript is great - for the happy path.
When everything goes right, the types guide us perfectly.
But when things go wrong, we're on our own.
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
A TypeScript library that makes errors visible, trackable, and safe
</div>

<!--
Effect is a powerful TypeScript library that brings errors into your type system.
It makes every possible failure explicit and gives you tools to handle them elegantly.
-->

---

# Before Effect

```ts
function doSomething() {
  const data = fetchData(); // might throw
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

```ts
function doSomething(): Effect<Data, FetchError | ParseError | SaveError> {
  return Effect.gen(function* () {
    const data = yield* fetchData(); // Effect<Data, FetchError>
    const parsed = yield* parseData(data); // Effect<Parsed, ParseError>
    return yield* saveData(parsed); // Effect<Data, SaveError>
  });
}

// The type tells us EXACTLY what can fail
```

<!--
With Effect, the function signature tells the complete story.
Every possible error is tracked in the type.
No surprises, no hidden failures.
And we write it almost like normal code - but with superpowers.
-->

---

# The Effect type

```ts twoslash
// ---cut-before---
import type { Effect } from "effect";

type Success = number;
type Requirements = never;

//                                    ┌─── What we get on success
//                                    │
//                                    │       ┌─── What errors can happen
//                                    │       │
//                                    │       │         ┌─── What we need to run
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

# Creating Effects

```ts twoslash
// ---cut-before---
import { Effect } from "effect";

const value = Effect.succeed(42);
// Effect<number, never, never>

const error = Effect.fail("Oops");
// Effect<never, string, never>
```

<!--
We create effects using Effect.succeed for successful values
or Effect.fail for errors.
Notice the types - Effect.succeed gives us a value with no possible errors.
Effect.fail gives us an error with no success value.
The type system tracks both.
-->

---

# A Real Example

```ts {all|1-3|5-7|9-13|all}
import { Data, Effect, Random } from "effect";

class DivideByZeroError extends Data.TaggedError("DivideByZeroError")<{}> {}

//      ┌─── Effect<number, DivideByZeroError, never>
//      ▼
function divide(a: number, b: number) {
  return Effect.gen(function* () {
    if (b === 0) {
      return yield* Effect.fail(new DivideByZeroError());
    }
    return a / b;
  });
}
```

<!--
Let's build something real. We'll make our divide function safer.

[click]
First, we define a custom error type. This is a tagged error that Effect can recognize.

[click]
The return type tells us everything: we get a number on success, or DivideByZeroError on failure.

[click]
Inside Effect.gen, we write almost normal code.
The 'yield*' is like 'await' - it unwraps Effect values.
If b is zero, we fail with our typed error.
Otherwise, we return the result.

[click]
Now the function signature is honest.
It tells us exactly what can happen.
-->

---

# Handling Errors - The Problem

```ts
const result = Effect.runSync(divide(4, 0));
// 💥 throws DivideByZeroError
```

<!--
If we run this Effect directly, it can throw.
We're back to the same problem - an unhandled error at runtime.
But now we know it's there because the type told us.
-->

---

# Handling Errors - The Solution

```ts {all|1-5|7-8|all}
const safeProgram = divide(4, 0).pipe(
  Effect.catchTag(
    "DivideByZeroError",
    () => Effect.succeed(0), // Return 0 when dividing by zero
  ),
); // Effect<number, never, never>

const result = Effect.runSync(safeProgram);
// 0 - Safe! ✅
```

<!--
Here's where Effect shines.

[click]
We use catchTag to handle specific errors by their tag.
TypeScript knows about DivideByZeroError because it's in the type.
When it happens, we recover by returning 0.

[click]
Look at the new type: Effect<number, never, never>
The error is GONE. We handled it completely.
Now when we run it, it's guaranteed to succeed.

[click]
This is the key insight: we can decide WHEN and WHERE to handle errors.
And the type system keeps perfect track of what's handled and what's not.
-->

---

# Multiple Errors

```ts {all|3-4|8-12|6-8|all}
import { Data, Effect } from "effect";

class NetworkError extends Data.TaggedError("NetworkError")<{}> {}
class ValidationError extends Data.TaggedError("ValidationError")<{}> {}

//      ┌─── Effect<User, NetworkError | ValidationError, never>
//      ▼
function saveUser(user: User) {
  return Effect.gen(function* () {
    yield* validateUser(user); // might fail with ValidationError
    return yield* sendToServer(user); // might fail with NetworkError
  });
}
```

<!--
Real programs have multiple failure modes.

[click]
We might have network errors, validation errors, database errors, and so on.

[click]
When we compose Effects, the errors accumulate in the type.

[click]
The type system tracks them all: NetworkError OR ValidationError.
Every possible failure is visible.
No hidden surprises.

[click]
And we can handle each error differently based on what makes sense.
-->

---

# Handling Multiple Errors

```ts {all|1-7|9-10|all}
const safeProgram = saveUser(user).pipe(
  Effect.catchTags({
    NetworkError: () => Effect.succeed(cachedUser),
    ValidationError: (error) => Effect.fail(new BadRequestError(error)),
  }),
);
// Effect<User, BadRequestError, never>

const result = Effect.runSync(safeProgram);
// Safe - all errors handled! ✅
```

<!--
We can handle multiple errors at once with catchTags.

[click]
For NetworkError, we fall back to a cached user.
For ValidationError, we transform it into a different error.

This is powerful - we can recover from some errors and transform others.
The type system tracks everything.

[click]
After handling, NetworkError and ValidationError are gone from the type.
We're left with only BadRequestError.

[click]
The type guides us to handle what's left.
We can't forget or ignore errors - they're right there in the signature.
-->

---

# Real World Impact

```ts
// Before: Generic, unhelpful
type RenewDomainError =
  | ApiError
  | StripePaymentError
  | StripePaymentMethodError;
```

<v-click>

```ts
// After: Specific, actionable
type RenewDomainError =
  | CustomerIdNotFoundError    | DomainsMutexError
  | DraftInvoiceError          | ExpirationDateOutOfRangeError
  | GetDomainInvoiceError      | GetDomainPriceError
  | InvalidDomainStatusError   | PayInvoiceError
  | RefundDomainInvoiceError   | RenewFailureError
  | SyncDomainError            | TLDConfigNotFoundError
  | UpdateVercelDomainError    | ... and more
```

</v-click>

<!--
Here's a real example from Vercel.
They had a feature for auto-renewing domains with mysterious failures.
Three generic error types told them almost nothing.

[click]
After adopting Effect, the error count jumped to 17 specific types.
That sounds worse, but it's actually great.
They weren't hiding problems anymore - they could see exactly what was failing.
Each error type points to a specific problem they can fix.
This is awareness over silence.
-->

---
layout: center
---

# More Errors = Fewer Problems

<!--
This might seem counterintuitive, but it's true.
When you can see all the errors, you can handle them properly.
Generic errors hide problems. Specific errors reveal solutions.
-->

---

# Beyond Error Handling

```ts
// Automatically retry with exponential backoff
const withRetry = fetchUser(id).pipe(
  Effect.retry(Schedule.exponential("100 millis")),
);

// Add a timeout
const withTimeout = fetchUser(id).pipe(Effect.timeout("5 seconds"));

// Combine both
const robust = fetchUser(id).pipe(
  Effect.retry(Schedule.exponential("100 millis")),
  Effect.timeout("5 seconds"),
);
```

<!--
Once errors are in the type system, you can compose them safely.
Effect gives you tools like retry with exponential backoff, timeouts, and more.
These aren't just nice features - they're type-safe transformations of your effects.
The compiler knows exactly what can still fail after each transformation.
-->

---
layout: section
---

# Key Takeaways

<v-clicks>

1. **TypeScript is great for the happy path**
2. **But errors are invisible in normal TypeScript**
3. **Effect makes errors explicit and trackable**
4. **Handle errors when and where it makes sense**
5. **The type system keeps you safe**

</v-clicks>

<!--
Let's recap what we've learned.

[click]
TypeScript gives us amazing safety for successful operations.

[click]
But when things fail, we lose that safety. Errors are invisible.

[click]
Effect brings errors into the type system, making them visible and trackable.

[click]
You can decide exactly when and how to handle each error.

[click]
And throughout all of this, the type system has your back.
No surprises. No hidden failures. Just honest, reliable code.
-->

---
layout: section
---

# Awareness over silence

<!--
This is the philosophy of Effect.
It's better to see all your errors and handle them explicitly
than to pretend they don't exist and hope for the best.
Your future self - and your users - will thank you.
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

---
hide: true
transition: none
---

# Rewriting with Effect

````md magic-move
```ts
// Traditional TypeScript code

class CannotDivideByZeroError extends Error {
  _tag = "CannotDivideByZeroError";
}

function divide(a: number, b: number) {
  if (b === 0) {
    throw new CannotDivideByZeroError();
  }
  return a / b;
}
```

```ts
import { Data, Effect } from "effect";

class CannotDivideByZeroError extends Data.TaggedError(
  "CannotDivideByZeroError",
) {}

function divide(a: number, b: number): Effect.Effect<number, Error> {
  if (b === 0) {
    return Effect.fail(new CannotDivideByZeroError());
  }
  return Effect.succeed(a / b);
}
```
````

<!--
So if we take our previous divide example - we can rewrite it with effect.
[click]
We can wrap the return success value in Effect.succeed and error in Effect.fail, and we can also use Effect's TaggedError for creating our error
-->

---
hide: true
---

# Rewriting with Effect

```ts twoslash
import { Data, Effect } from "effect";

class CannotDivideByZeroError extends Data.TaggedError(
  //                                  ^^^^^^^^^^^^^^^^
  "CannotDivideByZeroError",
) {}

function divide(a: number, b: number): Effect.Effect<number, Error> {
  if (b === 0) {
    return Effect.fail(new CannotDivideByZeroError());
    //     ^^^^^^^^^^^
  }
  return Effect.succeed(a / b);
  //     ^^^^^^^^^^^^^^
}
```

<img src="/divide-code.png" v-drag="[581,131,401,233]" />

<!--
So you can see, the code barely changes — but we’ve turned runtime errors into typed, predictable ones.
-->

---
hide: true
---

# Running the function

````md magic-move
```ts
try {
  // Regular function
  const result = divide(4, 0);
} catch (error) {
  // Error type is unknown
  if (error instanceof CannotDivideByZeroError) {
    console.error(error);
  }
}
```

```ts
import { Effect } from "effect";

// Effect<number, CannotDivideByZeroError>
const program = divide(4, 0);

const result = Effect.runSync(program);
```
````

<!--
It's not over. We need to run the program.
In tradition

 -->

<!--
עכשיו אם ננסה להריץ את הפונקציה שיצרנו היא לא תרוץ. כי effect זה כמו הblueprint של התוכנית. תחשבו על זה כמו פונקציה שמחזירה פונקציה - thunk. ככה אפשר לראות מה יכול לקרות בתוכנית ולעשות קומפוזיציה יפה של דברים ושגיאות ולקבל type safety. אז אנחנו נצטרך להריץ את הפונקציה מחזירה effect. בשביל זה נשתמש בrunSync. הנה השוואה בין הריצה של הפונקציה עם effect לפונקציה המקורית

Now, if we try to run the function we just created — it won’t actually execute.
That’s because an Effect is more like a blueprint of a program.
You can think of it like a function that returns another function — a thunk.
This lets us compose programs safely, understand what values or errors might occur, and get full type safety.
So to actually run the program, we need to execute the Effect — for example, using Effect.runSync.
Here’s a comparison between running a regular function and running one wrapped in an Effect.

 -->

<!--
אני יודע שזה טיפה מסובך אבל הקטע זה שאני כבר יודע מה הסוגי שגיאות שיכולים להיות לי

TypeScript is aware of the errors here!

אז הדבר הראשון זה לשנות את השגיאה ל
Data.TaggedError
 שזה די דומה לError עם _tag

 הדבר השני זה שבמקום לזרוק - אנחנו מחזירים fail או succeed
 ואז ברמת ה
 type
 אנחנו מקבלים Effect<number, CannotDivideByZeroError>

 והדבר השלישי שאנחנו מריצים את התוכנית. אפקט לא מריץ כלום עדיין זה רק התרשים איך נראית התוכנית.
 צריך להריץ אותה עם runSync

program.pipe(
  Effect.catchTags({
    CannotDivideByZeroError: (_CannotDivideByZeroError) => Effect.succeed(0),
);
-->

---
hide: true
---

#

````md magic-move
```ts
const main = async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
  const json = await response.json();
  return json;
};

main().then(console.log);
```

```ts
const fetchRequest = () => fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");

const jsonResponse = (response: Response) => response.json();

const main = async () => {
  const response = await fetchRequest();
  const json = await jsonResponse(response);
  return json;
};

main().then(console.log);
```

```ts
import { Effect, pipe } from "effect";

const fetchRequest = Effect.promise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.promise(() => response.json());

//
any, never>
const main = pipe(fetchRequest, Effect.flatMap(jsonResponse));

Effect.runPromise(main);
```

```ts
import { Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

// Effect<any, UnknownException>
const main = pipe(fetchRequest, Effect.flatMap(jsonResponse));

Effect.runPromise(main);
```

```ts
import { Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

// Effect<any, UnknownException>
const main = pipe(fetchRequest, Effect.flatMap(jsonResponse));

// Effect<any, never>
const revovered = pipe(
  main,
  Effect.catchTag("UnknownException", () =>
    Effect.succeed("There was an error"),
  ),
);

Effect.runPromise(recovered);
```

```ts
import { Effect, pipe } from "effect";

const fetchRequest = Effect.tryPromise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.tryPromise(() => response.json());

const main = pipe(
  fetchRequest,
  Effect.flatMap(jsonResponse),
  Effect.catchTag("UnknownException", () =>
    Effect.succeed("There was an error"),
  ),
);

Effect.runPromise(main);
```

```ts
const fetchRequest = Effect.promise(() =>
  fetch("https://pokeapi.co/api/v2/pokemon/garchomp/"),
);

const jsonResponse = (response: Response) =>
  Effect.promise(() => response.json());

const main = Effect.flatMap(fetchRequest, jsonResponse);

Effect.runPromise(main);
```

```ts
async function main() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    if (!response.ok) {
      throw new HttpError();
    }
    try {
      const data = await response.json();
    } catch (_stringifyError) {
      throw new JsonError();
    }
  } catch (_fetchError) {
    throw new FetchError();
  }
}
```

```ts
const fetchRequest = async () => {
  try {
    return await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
  }
  catch() {
    throw new FetchError()
  }
}

const jsonResponse = async (response: Response) =>{
  try {
    return await response.json();
  };
  catch(){
    throw new JsonError()
  }
}


function main(){
  const response = await fetchRequest();
  if(!response.ok){
    throw new HttpError()
  }
  const json = await jsonResponse(response);
  return json;
}

await main()
```

```ts
const fetchRequest = async () => {return
try{

  return await fetch("https://pokeapi.co/api/v2/pokemon/garchomp/");
  }
  catch(){
    throw new Error()
  }
}

const jsonResponse = async (response: Response) =>{ return await response.json();};

function main(){
  const response = await fetchRequest();
  const json = await jsonResponse(response);
  return json;
}

await main()
```

try {

if (!response.ok) {
throw new Error(
`HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
);
}

try {
const data = await response.json();
} catch (\_stringifyError) {
throw new Error(
"SyntaxError: Unexpected token ... in JSON at position ...",
);
}
} catch (\_fetchError) {
throw new Error("TypeError: Failed to fetch");
}
````

```ts
class FetchError extends Data.TaggedError("FetchError")<Readonly<{}>> {}

class JsonError extends Data.TaggedError("JsonError")<Readonly<{}>> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/psadokemon/garchomp/"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const main = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    return yield* new FetchError();
  }

  return yield* jsonResponse(response);
});
```

```

```

---
hide: true
---

# The Effect type

```ts twoslash
// ---cut-before---
import type { Effect } from "effect";

type Success = number;
type Requirements = never;

//           ┌─── Represents the success type
//           │      ┌─── Represents the error type
//           │      │         ┌─── Represents required dependencies
//           ▼      ▼         ▼
type ProgramEffect = Effect<Success, Error, Requirements>;
```

<!--
Let's start with the Effect type. It represent an action that can either success with Success type or fail with Error type.
-->

---
hide: true
---

# Effect values

```ts twoslash
import { Effect } from "effect";

//      ┌─── Effect<number, never>
//      ▼
const success = Effect.succeed(42);

//      ┌─── Effect<never, Error>
//      ▼
const failure = Effect.fail(new Error("Operation failed due to network error"));
```

<!--
Very similar to Promise.resolve() and Promise.reject() we can create effect that succeed with values or effect that fails with an error.
Notice that effect is a description of a program (like a function). But unlike Promise - it does not execute the code yet.
-->

---
hide: true
---

# Rewriting with Effect

````md magic-move
```ts
import { Effect } from "effect";

function divide(a: number, b: number): Effect.Effect<number, Error> {
  if (b === 0) {
    return Effect.fail(new Error("Cannot divide by zero"));
  }
  return Effect.succeed(a / b);
}
```

```ts
import { Data, Effect } from "effect";

class CannotDivideByZeroError extends Data.TaggedError(
  "CannotDivideByZeroError",
) {}

function divide(a: number, b: number): Effect.Effect<number, Error> {
  if (b === 0) {
    return Effect.fail(new Error("Cannot divide by zero"));
  }
  return Effect.succeed(a / b);
}
```

```ts
import { Data, Effect } from "effect";

class CannotDivideByZeroError extends Data.TaggedError(
  "CannotDivideByZeroError",
) {}

function divide(
  a: number,
  b: number,
): Effect.Effect<number, CannotDivideByZeroError> {
  if (b === 0) {
    return Effect.fail(new CannotDivideByZeroError());
  }
  return Effect.succeed(a / b);
}
```
````

<!--
Now if we go back to our example again - we can create it with effects.
:click
Now the type system infers that the program will result with Error or succeed with the result as number.
Effect have a convenient way to create Tagged errors using Data.TaggedError
-->

---
hide: true
---

# Running Effects

```ts twoslash
import { Effect } from "effect";

const program = Effect.sync(() => {
  console.log("Hello, World!");
  return 1;
});

const result = Effect.runSync(program);
// Output: Hello, World!

console.log(result);
// Output: 1
```

<!--
Here we have an effect with Effect.sync - this result is an Effect even without specifying Effect.success / Effect.fail. TypeScript infers the result type.
We can run the effect with Effect.runSync
-->

---
hide: true
---

# Running async effects

````md magic-move
```ts
import { Effect } from "effect";

// Effect<number, never>
const fetchNumber = Effect.promise(() => {
  return Promise.resolve(42);
});
```

```ts
import { Effect } from "effect";

// Effect<number, UnknownException>
const fetchNumber = Effect.tryPromise(() => {
  return Promise.resolve(42);
});
```

```ts
import { Data, Effect } from "effect";

class CannotFetchNumber extends Data.TaggedError("CannotFetchNumber") {}

// Effect<number, CannotFetchNumber>
const fetchNumber = Effect.tryPromise({
  try: () => Promise.resolve(42),
  catch: () => new CannotFetchNumber(),
});
```

```ts
import { Data, Effect } from "effect";

class CannotFetchNumber extends Data.TaggedError("CannotFetchNumber") {}

const fetchNumber = Effect.tryPromise({
  try: () => Promise.resolve(42),
  catch: () => new CannotFetchNumber(),
});

//      ┌─── Effect<number, CannotFetchNumber>
//      ▼
Effect.runPromise(fetchNumber).then(console.log);
```
````

<!--
We can create effects that describes async programs with Effect.promise
But it may fail so we will use Effect.tryPromise which may fail with UnknownException
We can map the error ourself using try-catch form
And we run the effect using runPromise
-->

---
hide: true
---

# Building Pipelines

```ts
import { pipe } from "effect"

pipe(input, func1, func2, ..., funcN)

┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌────────┐
│ input │───►│ func1 │───►│ func2 │───►│  ...  │───►│ funcN │───►│ result │
└───────┘    └───────┘    └───────┘    └───────┘    └───────┘    └────────┘
```

<!--
In order to build pipelines like control flow we need to get the value inside the effect.
We usually use pipe for it.
pipe takes the result of a function and provides ("pipes") it to the next one in the chain.
You can now read the program as a series of steps executed top-to-bottom.

Notice how this is similar to then with Promise.then
-->

---
hide: true
---

# Building Pipelines

```ts
import { pipe } from "effect";

// Define simple arithmetic operations
const increment = (x: number) => x + 1;
const double = (x: number) => x * 2;

// Sequentially apply these operations using `pipe`
const result = pipe(5, increment, double);

console.log(result);
// Output: 12
```

<!--
So here we start with 5, then call increment with 5 as param so we get 6 and then we double the result to 12
-->

---
hide: true
---

# Effect pipelines

```ts twoslash
import { Effect, pipe } from "effect";

// Function to apply a discount safely to a transaction amount
const applyDiscount = (
  total: number,
  discountRate: number,
): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error("Discount rate cannot be zero"))
    : Effect.succeed(total - (total * discountRate) / 100);

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100));

// Using Effect.map and Effect.flatMap
const result = pipe(
  fetchTransactionAmount,
  Effect.map((amount) => amount * 2),
  //     ^^^
  Effect.flatMap((amount) => applyDiscount(amount, 5)),
  //     ^^^^^^^
);

Effect.runPromise(result).then(console.log); // Output: 190
```

<!--
Here we start with the fetchTransactionAmount which is 100, then we use Effect.map to take this value and create a new effect with 200, then we use flatMap to map this value to a different effect. Map and FlatMap both returns an effect, the diffrence between map and flatMap is that flatMap parameter is a function that returns an effect while map function returns a value that is wrapped with effect
-->

---
hide: true
---

# Effect pipelines

```ts twoslash
import { Effect, pipe } from "effect";

// Function to apply a discount safely to a transaction amount
const applyDiscount = (
  total: number,
  discountRate: number,
): Effect.Effect<number, Error> =>
  discountRate === 0
    ? Effect.fail(new Error("Discount rate cannot be zero"))
    : Effect.succeed(total - (total * discountRate) / 100);

// Simulated asynchronous task to fetch a transaction amount from database
const fetchTransactionAmount = Effect.promise(() => Promise.resolve(100));

// Using Effect.andThen
const result = pipe(
  fetchTransactionAmount,
  Effect.andThen((amount) => amount * 2),
  //     ^^^^^^^
  Effect.andThen((amount) => applyDiscount(amount, 5)),
  //     ^^^^^^^
);

Effect.runPromise(result).then(console.log); // Output: 190
```

---
hide: true
---

# Effect Cheat Sheet

| API       | Input                                     | Output                      |
| --------- | ----------------------------------------- | --------------------------- |
| `map`     | `Effect<A, E, R>`, `A => B`               | `Effect<B, E, R>`           |
| `flatMap` | `Effect<A, E, R>`, `A => Effect<B, E, R>` | `Effect<B, E, R>`           |
| `andThen` | `Effect<A, E, R>`, \*                     | `Effect<B, E, R>`           |
| `tap`     | `Effect<A, E, R>`, `A => Effect<B, E, R>` | `Effect<A, E, R>`           |
| `all`     | `[Effect<A, E, R>, Effect<B, E, R>, ...]` | `Effect<[A, B, ...], E, R>` |

<!--
Effect.map takes the effect value and transform it to a value (Not effect),
Effect.flatMap takes the effect value and return a new Effect from it
Effect.andThen - takes the effect value and transform it like flatMap
Effect.tap tales the value, create a function that returns an effect and continue with the previous value - like console.log
Effect.all is similar to Promise.akk and takes multiple effect and transform their values
-->

---
hide: true
transition: view-transition
---

# Using generators for pipelines

```ts twoslash
import { Data, Effect } from "effect";

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

const fetchNumberWithUnknownException = Effect.tryPromise(() => {
  return Promise.resolve(42);
});

const fetchNumber = (max: number) =>
  Effect.tryPromise({
    try: () => Promise.resolve(Math.random() * max);,
    catch: () => new CannotFetchNumber();
  });

// ---cut-before---
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20); // yields number or CannotFetchNumber
  return yield* divide(40, denumerator); // yields number or CannotDivideByZero
});

//                   ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError>
//                   ▼
Effect.runPromise(program).then(console.log);
```

<!--
Sometimes it looks unfamilier and more complex to define the pipelines using pipes and functional programming form.
Effect offers a convenient syntax, similar to async/await, to write effectful code using generators using yield* (asterisk).
We can create a new effect using Effect.get. We need to provide a generator function to it.
Now very similar to await in async function - we can use yield astriks to get the effect resolved value and apply our transformations like in procedural programming
-->

---
transition: view-transition
hide: true
---

# Using generators for pipelines

````md magic-move
```ts
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20); // yields number or CannotFetchNumber
  return yield* divide(40, denumerator); // yields number or CannotDivideByZero
});

//                   ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError>
//                   ▼
Effect.runPromise(program).then(console.log);
```

```ts
//      ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError>
//      ▼
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20); // yields number or CannotFetchNumber
  return yield* divide(40, denumerator); // yields number or CannotDivideByZero
});
//      ┌─── Effect<number, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    CannotDivideByZeroError: (_CannotDivideByZeroError) => Effect.succeed(0),
    CannotFetchNumber: (_CannotFetchNumber) =>
      Effect.succeed(`Recovering from CannotFetchNumber`),
  }),
);

Effect.runPromise(recovered).then(console.log);
```
````

---
hide: true
---

# Error handling in practice

<v-clicks>

- Collecting possible errors
- Handling errors

</v-clicks>

<!--
Error handling in practice is 2 steps:
- Collecting possible errors
- Handling errors

This way we can separate program definition from error handling


We talked about how effect handle collecting the possible errors
-->

---
hide: true
---

# Handling errors

```ts twoslash
import { Data, Effect, UnknownException } from "effect";

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

const fetchNumber = (max: number) =>
  Effect.tryPromise({
    try: () => Promise.resolve(Math.random() * max),
    catch: () => new CannotFetchNumber(),
  });

// ---cut-before---
//      ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError>
//      ▼
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20);
  return yield* divide(40, denumerator);
});
//      ┌─── Effect<number | string, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    //   ^^^^^^^^^
    CannotDivideByZeroError: (_CannotDivideByZeroError) =>
      Effect.succeed(`Recovering from CannotDivideByZeroError`),
    CannotFetchNumber: (_CannotFetchNumber) =>
      Effect.succeed(`Recovering from CannotFetchNumber`),
  }),
);

Effect.runPromise(recovered).then(console.log);
```

<!--
Now we need to handle those errors.
This operation is called Recovering from an error.
We can use Effect catchTag or catchTags for it. It accept the error tag and returns a new effect.
We always know from the type what errors can happen so we get auto-completion about the error types.
So we can write the code like the happy path and handle them seperately
-->

---
hide: true
---

# Real world complexity

````md magic-move
```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
const data = await response.json();
const parsedData = mySchema.parse(data);
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  const parsedData = mySchema.parse(data);
} catch (error) {
  console.log("Could not fetch data");
}
```

```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }
  const data = await response.json();
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }
  try {
    const data = await response.json();
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }
  try {
    const data = await response.json();
    const parsedData = mySchema.parse(data);
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }
  try {
    const data = await response.json();
    try {
      const parsedData = mySchema.parse(data);
    } catch (_parseFailed) {
      throw new Error("Invalid input: expected string, received number");
    }
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```
````

<!--
TypeError: Failed to fetch
Non-OK responses (like 404, 500) response.ok
SyntaxError: Unexpected token ... in JSON at position ...

 -->

<!--
מתחיל עם ה3 שורות - כולנו מכירים אותם
אבל בטח אתם מטפלים בזה ככה
אתם יכולים. אבל הקוד מתעלם מהרבה דברים יותר גרנולרים שקורים.
נכון - פה ליוזר זה בטח לא הכי משנה - אבל לנו כמתכנתים כן כשאנחנו באים לדאבג את זה.
ויש הרבה מקרים אחרים שגם בתור יוזר היינו שמחים לקבל הודעה מה נכשל בדיוק ומה אפשר לעשות את זה חוץ מאשר הודעה גנרית.
משהו נכשל פה והמטרה של להביא את הדאטה לא הצליחה - אבל למה בדיוק ומה אפשר לעשות.
אנחנו לא רוצים שיהיה לנו שגיאה גנרית. יותר עוזר שיהיה לנו מידע

Real-world async code is tricky.
Let's start with the happy path.
:click
Now split it
A simple fetch can fail due to network errors, CORS, server errors, or auth failures.
Even if the response is ok, parsing JSON might throw syntax errors.
So we end up with nested try-catch blocks and lots of error handling boilerplate.
Plus, every async function must be awaited and wrapped to avoid unhandled promise rejections.
This complexity quickly grows and is hard to maintain.
-->

---
hide: true
---

# Wrap the results instead of throwing

```ts twoslash
type Result<Data, Error> =
  | { data: Data; error?: never }
  | { data?: never; error: Error };
```

<!--
In languages like Go, there’s no concept of throwing errors — you return them instead.
We can do something similar in TypeScript. By defining a Result type with Data and Error generics,
we can return either the data or the error — but never both
-->

---
hide: true
---

# Wrap the results instead of throwing

```ts twoslash
class CannotDivideByZeroError extends Error {
  _tag = "CannotDivideByZeroError";
}

type Result<Data, Error> =
  | { data: Data; error?: never }
  | { data?: never; error: Error };

// ---cut-before---
function divide(a: number, b: number): Result<number, CannotDivideByZeroError> {
  if (b === 0) {
    return { error: new CannotDivideByZeroError() };
    //       ^^^^^
  }
  return { data: a / b };
  //       ^^^^
}

const result = divide(4, 0);

if (result.error == null) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 75, height:130 }" :click-3="{ y: 205, height:150 }"  />

<img v-click="[2]" v-drag="[473,139,393,98]" src="/result-type.png" class="z-30" />

<img v-click="[5]" v-drag="[205,346,211,60]" src="/error-cannot-divide-prop.png" class="z-30" />

<img v-click="[4]" v-drag="[183,311,89,68]" src="/data-number.png" class="z-30" />

<!--
[click]
In languages like Go, there’s no concept of throwing errors — you return them instead.
We can do something similar in TypeScript.
[click]
Here, the Result type makes sure we either get data or error, but not both.

[click]
[click] 
TypeScript even infers the structure for us, so we can easily pattern match or check which case we’re in.
[click]
And the nice part is, it makes the function’s possible errors explicit in the type system.
[click]
But — and it’s a big but — it’s verbose.
-->

---
hide: true
---

```ts twoslash
import { Effect } from "effect";
import { $ } from "execa";

const getCurrentBranch = Effect.gen(function* () {
  try {
    const { message } = yield* Effect.tryPromise({
      try: () => $`git branch --show-current`,
      catch: (error) => error,
    });

    const branch = message.trim();
    yield* Effect.log(`Current branch: ${branch}`);
  } catch (error) {
    yield* Effect.logError(`Failed to get current branch: ${String(error)}`);
  }
});

// Run the effect
Effect.runPromise(getCurrentBranch);
```

---
hide: true
---

```ts twoslash
import { Data, Effect } from "effect";

// === Errors ===

// Tagged errors
export class InvalidEmail extends Data.TaggedError("InvalidEmail")<{
  readonly message: string;
}> {}

export class InvalidPassword extends Data.TaggedError("InvalidPassword")<{
  readonly message: string;
}> {}

export class UserNotFound extends Data.TaggedError("UserNotFound")<{
  readonly email: string;
}> {}

export class WrongPassword extends Data.TaggedError("WrongPassword")<{
  readonly message: string;
}> {}

// === Types ===
interface User {
  email: string;
  passwordHash: string;
}

// === In-memory user DB ===
const usersDb: Record<string, User> = {
  "alice@example.com": {
    email: "alice@example.com",
    passwordHash: "hashed123",
  },
};

// === Helpers ===
const validateEmail = (email: string) =>
  Effect.gen(function* () {
    if (!email.includes("@")) {
      return yield* Effect.fail(new InvalidEmail("Email is invalid"));
    }
    return email;
  });

const validatePassword = (password: string) =>
  Effect.gen(function* () {
    if (password.length < 6) {
      return yield* Effect.fail(new InvalidPassword("Password too short"));
    }
    return password;
  });

const findUserByEmail = (email: string) =>
  Effect.gen(function* () {
    const user = usersDb[email];
    if (!user) {
      return yield* Effect.fail(new UserNotFound("User not found"));
    }
    return user;
  });

const verifyPassword = (password: string, user: User) =>
  Effect.gen(function* () {
    // Simulate hash check
    const hashed = `hashed${password}`;
    if (user.passwordHash !== hashed) {
      return yield* Effect.fail(new WrongPassword("Password is incorrect"));
    }
    return "token-abc123"; // pretend JWT
  });

// === Login flow ===
const login = (email: string, password: string) =>
  Effect.gen(function* () {
    const validEmail = yield* validateEmail(email);
    const validPassword = yield* validatePassword(password);
    const user = yield* findUserByEmail(validEmail);
    const token = yield* verifyPassword(validPassword, user);
    return token;
  });

// === Run ===
Effect.runPromise(
  login("alice@example.com", "123").pipe(
    Effect.tap((token) => Effect.log(`✅ Login success! Token: ${token}`)),
    Effect.catchTags({
      InvalidEmail: (e) => Effect.logError(`❌ ${e.message}`),
      InvalidPassword: (e) => Effect.logError(`❌ ${e.message}`),
      UserNotFound: (e) => Effect.logError(`❌ ${e.message}`),
      WrongPassword: (e) => Effect.logError(`❌ ${e.message}`),
    }),
  ),
);
```

---
hide: true
---

# Watch for Unexpected Throws

```ts twoslash
// @filename: index.ts
// ---cut-before---
import { divide } from "./divide";

// @filename: divide.ts
export function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

try {
  const result = divide(4, 0); // throws new Error("Cannot divide by 0")
} catch (error) {
  //
}
```

<!--
We also need to remember that a function can throw an error,
and TypeScript won’t tell us.
There’s no throws annotation, so we have to be careful when calling functions that might fail.
-->

---
hide: true
---

```ts twoslash
import { Data, Effect } from "effect";

// Error types
export class InvalidProductId extends Data.TaggedError("InvalidProductId")<{
  readonly productId: string;
}> {}

export class ProductNotFound extends Data.TaggedError("ProductNotFound")<{
  readonly productId: string;
}> {}

export class OutOfStock extends Data.TaggedError("OutOfStock")<{
  readonly productId: string;
  readonly available: number;
}> {}

export class PaymentFailed extends Data.TaggedError("PaymentFailed")<{
  readonly reason: string;
}> {}

interface Product {
  id: string;
  name: string;
  stock: number;
  price: number;
}

const db: Record<string, Product> = {
  p1: { id: "p1", name: "Laptop", stock: 2, price: 1200 },
  p2: { id: "p2", name: "Mouse", stock: 0, price: 25 },
};

const validateProductId = (productId: string) =>
  Effect.gen(function* () {
    if (!productId.startsWith("p")) {
      return yield* Effect.fail(new InvalidProductId({ productId }));
    }
    return productId;
  });

const fetchProduct = (productId: string) =>
  Effect.gen(function* () {
    const product = db[productId];
    if (!product) {
      return yield* Effect.fail(new ProductNotFound({ productId }));
    }
    return product;
  });

const checkStock = (product: Product) =>
  Effect.gen(function* () {
    if (product.stock <= 0) {
      return yield* Effect.fail(
        new OutOfStock({ productId: product.id, available: product.stock }),
      );
    }
    return product;
  });

const chargeCustomer = (amount: number) =>
  Effect.gen(function* () {
    // Simulate random failure
    if (amount > 1000) {
      return yield* Effect.fail(new PaymentFailed({ reason: "Card declined" }));
    }
    return "payment-1234";
  });

const checkout = (productId: string) =>
  Effect.gen(function* () {
    const validatedId = yield* validateProductId(productId);
    const product = yield* fetchProduct(validatedId);
    const inStock = yield* checkStock(product);
    const paymentId = yield* chargeCustomer(inStock.price);
    return { message: "Order complete", paymentId, product: inStock };
  });

Effect.runPromise(
  checkout("p2").pipe(
    Effect.tap((result) =>
      Effect.log(
        `✅ Order confirmed for ${result.product.name}, Payment ID: ${result.paymentId}`,
      ),
    ),
    Effect.catchTags({
      InvalidProductId: (e) => Effect.logError(`❌ Invalid ID: ${e.productId}`),
      ProductNotFound: (e) =>
        Effect.logError(`❌ Product not found: ${e.productId}`),
      OutOfStock: (e) =>
        Effect.logError(
          `❌ Product ${e.productId} is out of stock (available: ${e.available})`,
        ),
      PaymentFailed: (e) => Effect.logError(`❌ Payment failed: ${e.reason}`),
    }),
  ),
);
```

<style>
pre.twoslash {
  max-height:500px
}
</style>

---
hide: true
---

```ts
class FetchError extends Data.TaggedError("FetchError")<Readonly<{}>> {}

class JsonError extends Data.TaggedError("JsonError")<Readonly<{}>> {}

const fetchRequest = Effect.tryPromise({
  try: () => fetch("https://pokeapi.co/api/v2/psadokemon/garchomp/"),
  catch: () => new FetchError(),
});

const jsonResponse = (response: Response) =>
  Effect.tryPromise({
    try: () => response.json(),
    catch: () => new JsonError(),
  });

const main = fetchRequest.pipe(
  Effect.filterOrFail(
    (response) => response.ok,
    () => new FetchError(),
  ),
  Effect.flatMap(jsonResponse),
  Effect.catchTags({
    FetchError: () => Effect.succeed("Fetch error"),
    JsonError: () => Effect.succeed("Json error"),
  }),
);
```

```ts
const main = Effect.gen(function* () {
  const response = yield* fetchRequest;
  if (!response.ok) {
    return yield* new FetchError();
  }

  return yield* jsonResponse(response);
});
```

---
hide: true
---

# Look at this function

```ts twoslash
// @filename: fetchData.ts
// @filename: index.ts
// ---cut-before---
import { fetchData } from "./fetchData";

export async function fetchData(itemsCount: number) {
  const response = await fetch("/url");
  const data = await response.json();
  return data as Array<{ name: string }>;
}
```

````md magic-move
```ts
const data = fetchData();
```

```ts
const data = fetchData(3);
```

```ts
const data = await fetchData(3);
```

```ts
try {
  const data = await fetchData(3);
} catch (error) {}
```

```ts
try {
  const data = await fetchData(3);
} catch (error) {
  console.log("Unexpected error");
}
```

```ts
try {
  const data = await fetchData(3);
} catch (error) {
  if (error instanceof NetworkError) {
    console.log("Network error");
  } else {
    console.log("Unexpected error");
  }
}
```

<!--
Look at this function
- Which parameters it requires?
- What does it return?
- It it Sync / Async?
- What dependencies does it need?
- Can it fail?
- What does it throw?

 -->
````

---
hide: true
---

# Real world complexity

````md magic-move
```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
const data = await response.json();
const parsedData = mySchema.parse(data);
```

```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

if (!response.ok) {
  throw new Error(
    `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
  );
}

const data = await response.json();
const parsedData = mySchema.parse(data);
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }

  const data = await response.json();
  const parsedData = mySchema.parse(data);
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }

  try {
    const data = await response.json();
    const parsedData = mySchema.parse(data);
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }

  try {
    const data = await response.json();
    try {
      const parsedData = mySchema.parse(data);
    } catch (_parseFailed) {
      throw new Error("Invalid input: expected string, received number");
    }
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```
````

<!--
TypeError: Failed to fetch
Non-OK responses (like 404, 500) response.ok
SyntaxError: Unexpected token ... in JSON at position ...

 -->

<!--
Real-world async code is tricky.
A simple fetch can fail due to network errors, CORS, server errors, or auth failures.
Even if the response is ok, parsing JSON might throw syntax errors.
So we end up with nested try-catch blocks and lots of error handling boilerplate.
Plus, every async function must be awaited and wrapped to avoid unhandled promise rejections.
This complexity quickly grows and is hard to maintain.
-->

---
hide: true
---

# Real world complexity

````md magic-move
```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
const data = await response.json();
const parsedData = mySchema.parse(data);
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  const data = await response.json();
  const parsedData = mySchema.parse(data);
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  try {
    const data = await response.json();
    const parsedData = mySchema.parse(data);
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
  try {
    const data = await response.json();
    try {
      const parsedData = mySchema.parse(data);
    } catch (_parseFailed) {
      throw new Error("Invalid input: expected string, received number");
    }
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```

```ts
try {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");

  if (!response.ok) {
    throw new Error(
      `HTTP error! Non-OK responses (like 404, 500) Status: ${response.status}`,
    );
  }

  try {
    const data = await response.json();
    try {
      const parsedData = mySchema.parse(data);
    } catch (_parseFailed) {
      throw new Error("Invalid input: expected string, received number");
    }
  } catch (_stringifyError) {
    throw new Error(
      "SyntaxError: Unexpected token ... in JSON at position ...",
    );
  }
} catch (_fetchError) {
  throw new Error("TypeError: Failed to fetch");
}
```
````

<!--
TypeError: Failed to fetch
Non-OK responses (like 404, 500) response.ok
SyntaxError: Unexpected token ... in JSON at position ...

 -->

<!--
Real-world async code is tricky.
A simple fetch can fail due to network errors, CORS, server errors, or auth failures.
Even if the response is ok, parsing JSON might throw syntax errors.
So we end up with nested try-catch blocks and lots of error handling boilerplate.
Plus, every async function must be awaited and wrapped to avoid unhandled promise rejections.
This complexity quickly grows and is hard to maintain.
-->

---
hide: true
---

# I had such use case

````md magic-move
```ts
import { $ } from "execa";

const { message: currentBranch } = await $`git branch --show-current`;
```

```ts
import { $ } from "execa";

try {
  const { message: currentBranch } = await $`git branch --show-current`;
} catch (error) {
  //  a lot of things can go wrong here
}
```
````

---
hide: true
---

# The Effect type

```ts twoslash
// ---cut-before---
import type { Effect } from "effect";

type Success = number;
type Requirements = never;
//                                 ┌─── Represents the success type
//                                 │        ┌─── Represents the error type
//                                 │        │      ┌─── Represents required dependencies
//                                 ▼        ▼      ▼
type ProgramEffect = Effect.Effect<Success, Error, Requirements>;
```

```

```

<!--
Let's start with the Effect type. It represent an action that can success with type Success, fail with Error and may depend on Requirements for dependency injection
-->
