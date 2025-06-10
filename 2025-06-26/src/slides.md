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

This talk will hopefully change the way you think about handling errors — not just catching them, but modeling them.
We’ll do that using the Effect library.

-->

---
hide: true
---

# Look at this function

```ts twoslash
// @filename: fetchData.ts
export async function fetchData(itemsCount: number){
  const response = await fetch("/url")
  const data = await response.json()
  return data as Array<{name: string}>;
}


// @filename: index.ts
// ---cut-before---
import { fetchData } from "./fetchData"
```


````md magic-move

```ts
const data = fetchData()
```

```ts
const data = fetchData(3)
```

```ts
const data = await fetchData(3)
```

```ts
try {
  const data = await fetchData(3)
}
catch(error) {

}
```

```ts
try {
  const data = await fetchData(3)
}
catch(error) {
  console.log("Unexpected error")
}
```

```ts
try {
  const data = await fetchData(3)
}
catch(error) {
  if(error instanceof NetworkError){
    console.log("Network error")
  }
  else {
    console.log("Unexpected error")
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
title: About me
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

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(10, 2); // 5

divide("hi", 2);
```

<!--
TypeScript is great — it helps us catch errors early.
If a function expects a certain type and we pass something else, we get a compile-time error.

> (Hover on result)

 TypeScript infers the return type automatically, which makes composition much easier.
-->

---

# Edge cases

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(4, 0); // Infinity
```

<!--
> <numerator/denomerator>

In real-world apps, we need to handle edge cases.
For example, dividing by 0 returns Infinity — it’s a valid number, but probably not what we expect.
TypeScript doesn’t catch this, because the types are technically correct.

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
} catch (error) {
  // `error` is unknown
}
```

<!--
We can throw an error and catch it using a try-catch block.

> (hover over error)

But if you hover over error, you’ll see it’s typed as unknown.
That means we have to manually check its shape or cast it — not ideal for safety or DX.
-->

---
layout: section
---

# Error handling in TypeScript

---

# We need to check the error types ourselves

```ts twoslash
class DivededByZeroError extends Error {
  _tag = "DivededByZeroError";
}

function divide(a: number, b: number) {
  if (b === 0) {
    throw new DivededByZeroError();
  }
  return a / b;
}

try {
  const result = divide(4, 0);
} catch (error) {
  // Error type is unknown
  if (error instanceof DivededByZeroError) {
    console.error(error);
  }
}
```

<!--
One option is to define a custom error class.
That way, we can check the type inside the catch block and handle it accordingly.

> (Hover on error)

 it’s still typed as unknown, so we need a type guard like instanceof.
This works, but it’s manual and easy to forget or get wrong.

-->

---

# Wrap the results instead of throwing

```ts twoslash
class DivededByZeroError extends Error {
  _tag = "DivededByZeroError";
}

type Result<Data, Error> =
  | { data: Data; error?: never }
  | { data?: never; error: Error };

function divide(a: number, b: number): Result<number, DivededByZeroError> {
  if (b === 0) {
    return { error: new DivededByZeroError() };
  }
  return { data: a / b };
}

const result = divide(4, 0);

if (result.error == null) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

<!--
In languages like Go, there’s no concept of throwing errors — you return them instead.
We can do something similar in TypeScript.
Here, the Result type makes sure we either get data or error, but not both.

> hover the console.log()

TypeScript infers the structure nicely, and we can pattern match or check discriminators.
This also makes the function’s possible errors explicit in the type.
But — and it’s a big but — it’s verbose.
Composing multiple such functions gets messy, since we now have to wrap and unwrap manually all the way through.
-->

---

# Real world complexity

````md magic-move
```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
const data = await response.json();
```

```ts
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
// TODO: Network errors, CORS, Server internal errors, Auth failed errros
if (response.ok) {
  // Parsing to JSON can go wrong
  const data = await response.json();
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
    try{
      const parsedData = mySchema.parse(data)
    }
    catch(_parseFailed){
      throw new Error("Invalid input: expected string, received number")
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
layout: section
---

# TypeScript is great

<div v-click class="text-2xl">
For the happy path
</div>

---
layout: section
---

# No **type-safety** for **errors**

---
layout: section
---

# [Effect](https://effect.website/docs/getting-started/introduction/)

<div v-click class="text-2xl">
is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.
</div>

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
type Success = number;
type Requirements = never;
// ---cut-before---
import type { Effect } from "effect";
//                                 ┌─── Represents the success type
//                                 │        ┌─── Represents the error type
//                                 │        │      ┌─── Represents required dependencies
//                                 ▼        ▼      ▼
type ProgramEffect = Effect.Effect<Success, Error, Requirements>;
```

<!--
Let's start with the Effect type. It represent an action that can success with type Success, fail with Error and may depend on Requirements for dependency injection
-->

---

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
Let's start with the Effect type. It represent an action that can success with type Success, fail with Error and may depend on Requirements for dependency injection
-->

---
hide: true
---

# The effect type conceptually

```ts
type Effect<Success, Error, Requirements> = (
  context: Context<Requirements>,
) => Error | Success;
```

<!--
Conceptually - we can thing about Effect type like this one
-->

---
hide: true
---

```ts twoslash
import { Effect, Context } from "effect";

class SomeContext extends Context.Tag("SomeContext")<SomeContext, {}>() {}

// Assume we have an effect that succeeds with a number,
// fails with an Error, and requires SomeContext
declare const program: Effect.Effect<number, Error, SomeContext>;

// Extract the success type, which is number
type A = Effect.Effect.Success<typeof program>;

// Extract the error type, which is Error
type E = Effect.Effect.Error<typeof program>;

// Extract the context type, which is SomeContext
type R = Effect.Effect.Context<typeof program>;
```

---

# Effect values

```ts twoslash
import { Effect } from "effect";

//      ┌─── Effect<number, never, never>
//      ▼
const success = Effect.succeed(42);

//      ┌─── Effect<never, Error, never>
//      ▼
const failure = Effect.fail(new Error("Operation failed due to network error"));
```

<!--
Very similar to Promise.resolve() and Promise.reject() we can create effect that succeed with values or effect that fails with an error
-->

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
    return Effect.fail(new CannotDivideByZeroError());
  }
  return Effect.succeed(a / b);
}
```
````

<!--
Now if we go back to our example again - we can create it with effects.
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

# Running async effects

````md magic-move
```ts
import { Effect } from "effect";

const fetchNumber = Effect.tryPromise(() => {
  return Promise.resolve(42);
});
```
```ts
import { Data, Effect } from "effect";

class CannotFetchNumber extends Data.TaggedError("CannotFetchNumber") {}

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

//      ┌─── Effect<number, CannotFetchNumber, never>
//      ▼
Effect.runPromise(fetchNumber).then(console.log);
```
````

---

# Building Pipelines

```ts
import { pipe } from "effect"

pipe(input, func1, func2, ..., funcN)

┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌───────┐    ┌────────┐
│ input │───►│ func1 │───►│ func2 │───►│  ...  │───►│ funcN │───►│ result │
└───────┘    └───────┘    └───────┘    └───────┘    └───────┘    └────────┘
```

---

```ts
import { pipe } from "effect"

// Define simple arithmetic operations
const increment = (x: number) => x + 1
const double = (x: number) => x * 2

// Sequentially apply these operations using `pipe`
const result = pipe(5, increment, double)

console.log(result)
// Output: 12

```

---

# Async Generators

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

//                   ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError, never>
//                   ▼
Effect.runPromise(program).then(console.log);
```

<!--
Effect offers a convenient syntax, similar to async/await, to write effectful code using generators using yield* (asterisk).
It yields the error.
-->

---

# New ?

````md magic-move
```ts
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20); // yields number or CannotFetchNumber
  return yield* divide(40, denumerator); // yields number or CannotDivideByZero
});

//                   ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError, never>
//                   ▼
Effect.runPromise(program).then(console.log);
```
```ts
//      ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError, never>
//      ▼
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20); // yields number or CannotFetchNumber
  return yield* divide(40, denumerator); // yields number or CannotDivideByZero
});
//      ┌─── Effect<number, never, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    CannotDivideByZeroError: (_CannotDivideByZeroError) =>
      Effect.succeed(0),
  CannotFetchNumber: (_CannotFetchNumber) =>
      Effect.succeed(`Recovering from CannotFetchNumber`),
  }),
);

Effect.runPromise(recovered).then(console.log);
```
````

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
//      ┌─── Effect<number, CannotFetchNumber | CannotDivideByZeroError, never>
//      ▼
const program = Effect.gen(function* () {
  const denumerator = yield* fetchNumber(20);
  return yield* divide(40, denumerator);
});
//      ┌─── Effect<number, never, never>
//      ▼
const recovered = program.pipe(
  Effect.catchTags({
    CannotDivideByZeroError: (_CannotDivideByZeroError) =>
      Effect.succeed(`Recovering from CannotDivideByZeroError`),
  CannotFetchNumber: (_CannotFetchNumber) =>
      Effect.succeed(`Recovering from CannotFetchNumber`),
  }),
);

Effect.runPromise(recovered).then(console.log);
```

---

# Erros vs Defects

There are two kinds of errors-those that we can expect, program defensively against, and analyze statically-and those that are truly exceptional and outside of our control.

---
layout: center
---

# We can use the type system to track **errors** and **context**, not only **success** values.

---

# Effect helps you to fix your unsafe assumption


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
hide: true
---
```ts twoslash
import { $ } from "execa";
try {
  const { message: currentBranch } = await $`git branch --show-current`;
} catch (error) {
  console.error(error);
}
```

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

# Links

- [Effect: Beginners Complete Getting Started](https://www.typeonce.dev/course/effect-beginners-complete-getting-started)

# The tweet about types

https://x.com/dillon_mulroy/status/1898590282020450681

And the part of this slide
https://www.youtube.com/watch?v=VcOIz7tOBoM&list=PL4mWVugy3a2il28mbeNmyjJDoHOvw4JTK&index=13

# TypeScript happy path

https://x.com/dillon_mulroy/status/1803430049254633492

Also -
https://x.com/dillon_mulroy/status/1799811526020538555

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
