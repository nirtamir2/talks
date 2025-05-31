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
Hello everyone, thanks a lot for having me and I hope you are enjoying the conference so far.

It's my first time speaking in a conference. But I hope my topic today would be interesting to you
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
Before we dive in, let me introduce myself. I'm Nir Tamir, a senior frontend developer passionate about open source and tooling. I work with early-stage startups, helping them leverage cutting-edge technologies like AI.
-->

---

# TypeScript is great

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(4, 2);

divide("hi", 2);
```

<!--
TypeScript is great. It helps us prevent erros. If a function accept a value and we try to call it with a different type value - we get
a compile time error. This is great and it helps prevent errors. Also it infers the return type so if we create transformations TypeScript is aware of that. Here for example we can define a function that accept two integers and divide the first in the second
-->

---

# But we need to catch some edge cases

```ts twoslash
function divide(a: number, b: number) {
  return a / b;
}

const result = divide(4, 0); // Infinity
```

<!--
numerator/denomerator 
But sometimes we need to take care of edge cases like when the denomerator is 0, because we don't want to handle Infinity
-->

---

# The TypeScript type system doesn't care about those

```ts twoslash
class DivededByZeroError extends Error {
  _name = "Cannot divide by zero";
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
So we can throw a custom error to handle it. But we lost the type safety by doing it
-->

---

# We can return different type for it like in Go

```ts twoslash
class DivededByZeroError extends Error {
  _name = "Cannot divide by zero";
}

type Result = { data: number, error?: never } | { data?: never, error: DivededByZeroError };

function divide(a: number, b: number ): Result {
  if (b === 0) {
    return { error: new DivededByZeroError() };
  }
  return { data: a / b };
}

const result = divide(4, 0);

if (result.data == null) {
  console.error(result.error);
} else {
  console.log(result.data);
}
```

<!--
In language like Go we usually don't have the concept of throwing errors so we can have a return value and propegate it.
But its not convenient that much. Also - errors are part of the language and some functions throw errors. We can also have async code example
-->

---

# Async TypeScript is a litte bit harder

```ts twoslash
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
const data = await response.json();
```

<!--
Take this code for example - we can have a lot of options to fail in this simple API request.
But when we have async stuff things can go
-->

---

```ts twoslash
const response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
// TODO: Network errors, CORS, Server internal errors, Auth failed errros
if(response.ok){
    // Parsing to JSON can go wrong
   const data = await response.json();
   // What about the result - validation with a schema
}
```

---

# When you start using async - you mark your functions with async
and you need to take care about floating promises

---

# I wish we could hanlde type-safety for errors

---

---

# [Effect](https://effect.website/docs/getting-started/introduction/) is a powerful TypeScript library designed to help developers easily create complex, synchronous, and asynchronous programs.


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

```ts twoslash
import {Effect} from "effect";
//       ┌─── Produces a value of type number
//       │       ┌─── Fails with an Error
//       │       │      ┌─── Requires no dependencies
//       ▼       ▼      ▼
type MyEffect = Effect<number, Error, never>
```

---

# Erros vs Defects

---

```ts twoslash
import {Effect} from "effect"
Effect.success("good")
Effect.fail("bad")
```

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

> typescript/javascript happy path blindness is real.
>
> go through a critical code path in your application and note every single place an error can be thrown. are you handling each appropriately?
>
> we did this with part of our domain renewal flow.
>
> from 3 errors to 17
