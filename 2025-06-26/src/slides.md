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

const result = divide("hi", 2);
```

<!--
If a function expects a certain type and we pass something else, we get a compile-time error.
-->

---

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(1, 2); // number
```

 <img src="/result-number.png" v-drag="[92,198,67,68]" />

<!--
And after we fix the error - TypeScript infers the return type automatically, which makes composition much easier.
-->

---
transition: view-transition
---

# Edge cases

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(4, 0); // Infinity
```

<img src="/result-number.png" v-drag="[92,198,67,68]" />

<!--
> <numerator/denomerator>

In real-world apps, we hit edge cases the type system can’t catch.
For example, dividing by zero returns Infinity.
It’s a valid number, so TypeScript’s fine with it —
but it’s probably not what we expect.
-->

---

# Errors in TypeScript are unknown

```ts twoslash
function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

try {
  const result = divide(4, 0); // throws new Error("Cannot divide by 0")
} catch (error) {}
```

 <img src="/error-unknown.png" v-drag="[114,293,67,68]" v-click />

<!--
We can throw an error and catch it using a try-catch block.

[click]

But notice — the error variable is typed as unknown.
That means it has no idea what the error looks like —
so we have to manually check its shape or cast it.
It works, but it’s not very safe or convenient.
-->

---
hide: true
---

# Watch for Unexpected Throws

```ts twoslash
// @filename: divide.ts
export function divide(a: number, b: number) {
  if (b === 0) {
    throw new Error("Cannot divide by 0");
  }
  return a / b;
}

// @filename: index.ts

// ---cut-before---
import { divide } from "./divide";

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

# Watch for Unexpected Throws

````md magic-move
```ts
import { divide } from "./divide";

const result = divide(4, 0);
```

```ts
import { divide } from "./divide";

const result = divide(4, 0); // throws new Error("Cannot divide by 0") 🚨
```

```ts
import { divide } from "./divide";

try {
  const result = divide(4, 0); // throws new Error("Cannot divide by 0") 🚨
} catch (error) {
  handleError(error);
}
```
````

<!--
We also need to remember that a function can throw an error,
and TypeScript won’t tell us.
There’s no throws annotation, so we have to be careful when calling functions that might fail.
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

```ts twoslash
class CannotDivideByZeroError extends Error {
  _tag = "CannotDivideByZeroError";
}

// ---cut-before---
function divide(a: number, b: number) {
  if (b === 0) {
    throw new CannotDivideByZeroError();
    //        ^^^^^^^^^^^^^^^^^^^^^^^^^^
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // Error type is unknown
  if (error instanceof CannotDivideByZeroError) {
    console.error(error);
  }
}
```

<div :initial="{ x: -80 }" :enter="{ x: 0, y: 0 }" v-click v-motion class="absolute pointer-events-none left-14 w-217 border-2 border-teal rounded-xl bg-teal/10 z-20 top-5" :click-1="{ y: 75, height:130 }" :click-3="{ y: 205, height:160 }" />

<img v-click="[2]" v-drag="[380,125,482,98]" src="/error-class-definition.png" class="z-30" />

<img v-click="[4]" v-drag="[96,292,108,98]" src="/error-unknown.png" class="z-30" />

<img v-click="[5]" v-drag="[174,349,212,64]" src="/error-cannot-divide-by-zero.png" class="z-30" />

<!--
[click]
One option is to define a custom error that extends error.
[click]
This lets us throw a specific type of error instead of a generic one.
[click]
That way, we can check the type inside the catch block and handle it accordingly.
[click]
it’s still typed as unknown, so we need a type guard like instanceof.
[click]
This works, but it’s manual and easy to forget or get wrong.
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
class StepFiveError extends Error {
  _tag = "StepFiveError";
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
function stepFive(a: number): Result<number, CannotDivideByZeroError> {
  if (a === 0) {
    return { error: new StepFiveError() };
  }
  return { data: a };
}

type DoSomethingResult = Result<
  | number
  | StepOneError
  | StepTwoError
  | StepThreeError
  | StepFourError
  | StepFiveError
>;

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

  const c = stepThree(b.data);
  if (c.error != null) {
    return c;
  }

  const d = stepFour(c.data);
  if (d.error != null) {
    return c;
  }
  return stepFive(c.data);
}
```

<!--
Composing multiple such functions gets messy, since we now have to wrap and unwrap manually all the way through.
-->

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

`````

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

## layout: section

# TypeScript is great

<div v-click class="text-2xl">
For the happy path
</div>

---

## layout: section

# No **type-safety** for **errors**

---

## layout: section

# [Effect](https://effect.website/docs/getting-started/introduction/)

<div v-click class="text-2xl">
is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.
</div>

---

# Rewriting with Effect

````md magic-move
```ts
class CannotDivideByZeroError extends Error {
  _tag = "CannotDivideByZeroError";
}

function divide(a: number, b: number) {
  if (b === 0) {
    throw new CannotDivideByZeroError();
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // Error type is unknown
  if (error instanceof CannotDivideByZeroError) {
    console.error(error);
  }
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

// Effect<number, CannotDivideByZeroError>
const program = divide(4, 0);

const result = Effect.runSync(program);
```
````

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

// Effect<any, never>
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

## hide: true

# The Effect type

```ts twoslash
type Success = number;
type Requirements = never;
// ---cut-before---
import type { Effect } from "effect";
//                                 ┌─── Represents the success type
//                                 │        ┌─── Represents the error type
//                                 │        │
//                                 ▼        ▼
type ProgramEffect = Effect.Effect<Success, Error>;
```

<!--
Let's start with the Effect type. It represent an action that can either success with Success type or fail with Error type.
-->

---

## hide: true

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

## hide: true

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

## hide: true

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

## hide: true

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

## transition: view-transition

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

## hide: true

# Erros vs Defects

There are two kinds of errors-those that we can expect, program defensively against, and analyze statically-and those that are truly exceptional and outside of our control.

---

## layout: center

# We can use the type system to track **errors** and **context**, not only **success** values.

---

## layout: section

# TypeScript is great

<div v-click class="text-2xl">
For the happy path
</div>

<!--
When you execute any plain typescript function you have no way of knowing what may go wrong unless you read the function implementation
-->

---

## layout: section

# Effect can help

<div v-click class="text-2xl">
When the happy path ends
</div>

<!--
# Effect helps you to fix your unsafe assumption. You can write your code in the happy path just like TypeScript, and handle errors later. This way you won't have suprises about how do the function failes - and you can handle not only generic errors - but also recover from them.
-->

---

## layout: two-cols

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
At vercel they had supported audo renewals for domains and they had a lot of issues.
But using neverthrow and similar concepts from effect they
-->

---

layout: intro
class: text-center pb-5
glowX: 50
glowY: 120

---

<h1 text-4xl>
Thank you！
</h1>

Slides available at [nirtamir.com](https://nirtamir.com)

---

## hide: true

```ts twoslash
import { $ } from "execa";
try {
  const { message: currentBranch } = await $`git branch --show-current`;
} catch (error) {
  console.error(error);
}
```

---

## hide: true

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

## hide: true

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

## hide: true

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

## hide: true

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

## title: notes

When you execute any plain typescript function you have no way of knowing what may go wrong unless you read the function implementation

Error handling in practice is 2 steps:

Collecting possible errors
Handling errors

Before running the effect we write some code to define what happens if Effect contains UnknownException.

This operation is called Recovering from an error.

we always know from the type what errors can happen.

Separate program definition from error handling

# Links

- [Effect website](https://www.effect.website)
- [Effect: Beginners Complete Getting Started](https://www.typeonce.dev/course/effect-beginners-complete-getting-started)

# The tweet about types

https://x.com/dillon_mulroy/status/1898590282020450681

And the part of this slide
https://www.youtube.com/watch?v=VcOIz7tOBoM&list=PL4mWVugy3a2il28mbeNmyjJDoHOvw4JTK&index=13

# TypeScript happy path

https://x.com/dillon_mulroy/status/1803430049254633492

Also -
https://x.com/dillon_mulroy/status/1799811526020538555

Also:

https://x.com/RhysSullivan/status/1971409275152130541

https://www.youtube.com/watch?v=VcOIz7tOBoM&list=PL4mWVugy3a2il28mbeNmyjJDoHOvw4JTK&index=13

> Happy path blindness

What happens if Auth.check throws? Does
it throw? Can it throw more than one kind of
error?
What about Db.queryDomain?
→ Can we retry on any errors?
→ If so, do we need to consider a backoff
interval for retrying?
How should we communicate errors to
callers? Should we pass through errors? All of
them? Should we wrap them with custom
errors?

The benefits
→ Crystal clear guarantees of how our code will
run at a glance. If the computation succeeds we'll
end up with the Ok type, if it fails we'll end up with
Err type
→ No hidden control flow (e.g. try/catch).
→ The result type is composable. We can chain
computations together that may fail, with static
guarantees that we'll gracefully handle the
unhappy path.
→ Typed error tracking via unions on the Err type.

Treating errors as values with the Result type-whether
with an implementation like neverthrow or a simple
discriminated union-will make your code safer, more
resilient, and predictable.

Defects
There are two kinds of errors-those
that we can expect, program
defensively against, and analyze
statically-and those that are truly
exceptional and outside of our contro l.

Errors are typed as unknown

```ts
try
}
catch
(error: unknown) {
}
```

> typescript/javascript happy path blindness is real.
>
> go through a critical code path in your application and note every single place an error can be thrown. are you handling each appropriately?
>
> we did this with part of our domain renewal flow.
>
> from 3 errors to 17

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

## hide: true

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

## hide: true

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

## hide: true

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

## hide: true

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
`````

<!--
Let's start with the Effect type. It represent an action that can success with type Success, fail with Error and may depend on Requirements for dependency injection
-->
