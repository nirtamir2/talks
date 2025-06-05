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
title: About me
layout: image-right
image: ./nirtamir.png
---

# Nir Tamir

- Senior Frontend developer
- Loves open source and tooling
- <mdi-web /> [nirtamir.com](https://nirtamir.com)
<!-- - <mdi-github /> [@nirtamir2](https://github.com/nirtamir2)
- <mdi-twitter /> [@NirTamir](https://twitter.com/NirTamir)
- <mdi-linkedin /> [@nirtamir2](https://linkedin.com/in/nirtamir2) -->

<!--
My name is Nir Tamir and I'm a frontend developer more than a decade.
You find me at nirtamir.com
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
TypeScript is great. It helps us prevent erros. If a function accept a value and we try to call it with a different type value - we get
a compile time error.

> hover on result 

TypeScript infers the response type automatically and this makes composition easier
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

But in real-world apps we need to take care of edge cases.
If we call the `divide` function with 0 as the denomerator - we will get Infinity value.
It's a valid number - but not expected.
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
So we can throw an error and wrap the code with try-catch block.

> hover over error

But error has an unknown type
-->

---

# We need to check the error types ourself

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
So we can throw a custom error to handle it.

> hover on `error`

 Error in catch is still unknown but we can check if it looks like our Error type and handle it.
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
In language like Go we usually don't have the concept of throwing errors so we can have a return value and propegate it.
TypeScript is very good in infering the result type - so we can use it too.
We can define a type that returns either the result or an error but not both. We can also use discriminator.
The way we know which errors do the function throw and we can sure we handle them even without looking into the implementation - from the type system.
But its not convenient that much - it's a lot more code. And when we composite it with other functions and don't want to ignore the error and don't want to immediately handle it - we need to wrap the data and the errors for all the functions.
-->

---

# Async TypeScript is a litte bit harder

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
  // What about the result - validation with a schema
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
````

<!--
TypeError: Failed to fetch
Non-OK responses (like 404, 500) response.ok
SyntaxError: Unexpected token ... in JSON at position ...

 -->

<!--
Here is another real-world example.
This code can fail for so many reasons. Network error, Server internal error, JSON parse error, Authentication error...
Once we have to call async function that and "await" for its result - we need to "color" this function with async and we get many async functions in the codebase.
And in async javascript code we don't want to have floating promises - so we need to handle every "await" statement function with try-catch blocks so we won't miss the error handling.
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

```ts
              ┌─── Represents the success type
              │        ┌─── Represents the error type
              │        │      ┌─── Represents required dependencies
              ▼        ▼      ▼
type Effect<Success, Error, Requirements> = (
  context: Context<Requirements>
) => Error | Success
```

<!--
The Effect type is an immutable description of a workflow or operation that is lazily executed. This means that when you create an Effect, it doesn’t run immediately, but instead defines a program that can succeed, fail, or require some additional context to complete.
-->

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

```ts twoslash
import { Effect } from "effect";

//      ┌─── Effect<never, Error, never>
//      ▼
const failure = Effect.fail(new Error("Operation failed due to network error"));

//      ┌─── Effect<number, never, never>
//      ▼
const success = Effect.succeed(42);
```

---

```twoslash ts
import { Effect } from "effect"

function divide(a: number, b: number): Effect.Effect<number, Error> {

  if(b === 0)
    {
      return Effect.fail(new Error("Cannot divide by zero"))
    }
   return Effect.succeed(a / b)
}

```

---

# Erros vs Defects

---

---

# Main

```ts

```

---
layout: center
---

# We can use the type system to track **errors** and **context**, not only **success** values.

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
