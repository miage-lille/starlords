# Star Lords Kata

## LIGO

[LIGO](https://ligolang.org) is a strongly and statically typed language for writing [Tezos](https://tezos.com) smart contracts.

LIGO currently offers three syntaxes:

- JsLIGO, a TypeScript/JavaScript inspired syntax that aims to be familiar to those coming from TypeScript/JavaScript.

- CameLIGO, an OCaml inspired syntax that allows you to write in a functional style.

- PascaLIGO, a syntax inspired by Pascal which provides an imperative developer experience.

For this training we will use JsLIGO.

While inspired by Typescript, there is some differences, like having `;` mandatory and different top level types:

- no `number` but there is `int`, `nat` or `tez` - Tezos token unit - for numerical types
- specific types for blockchain like `address` or `contract<T>`
- different container types : `list<T>`, `set<T>`, `map<K, V>`, `big_map<K, V>` (aka lazy map)
- `unit` is similar to `void`

And more...

**You must bookmark [API Doc](https://ligolang.org/docs/reference/toplevel?lang=jsligo) for this training**

```ts
type storage = int;

type parameter =
  { kind: "Increment"; payload: int }
  | { kind: "Decrement"; payload: int }
  | { kind: "Reset" };

type return_ = [list<operation>, storage];

let main = (action: parameter, store: storage): return_ => {
  const noop = list([]);
  switch (action.kind) {
    case "Increment":
      return [noop, store + action.payload];
    case "Decrement":
      return [noop, store - action.payload];
    case "Reset":
      return [noop, 0];
  }
};
```

This LIGO contract accepts the following LIGO expressions: Increment(n), Decrement(n) and Reset. Those serve as entrypoint identification.

A minimum LIGO contract have:

- `type storage` definition
- `type parameter` definition
- `main function` definition

The contract storage can only be modified by activating a main function: given the state of the storage on-chain, a main function specifies how to create another state for it, depending on the contract's parameter.

## Galaxy

We are creating a smart contract to manage a system of stars. You will learn to:

- Create a smart contract
- Deploy a smart contract
- Use a wallet
- Use an indexer

### Design planets

### Exercice 1

Inside [galaxy.jsligo](./contracts/galaxy.jsligo)

- Create a type `coordinate` which is a triplet of `int` and reprensent (x, y, z) coordinates
- Create a type `planet_type` which represent the type of the planet and can either be "Terrestrial", "Gaseous" or "Other"
  - NB: there is no union type, only tagged unions in JsLIGO
- Create a type `planet` which is defined by a `name`, `coordinate`, `planet_type`, `density` (a natural number) and a `lord` (an optional `address` that represent the owner of a planet)

### Exercice 2

From the types define previously, define a valid contract where:

- The storage is a [big_map](https://ligolang.org/docs/reference/big-map-reference?lang=jsligo) where planets are indexed by their name
- A contract user can do the following operations:
  - `Discover` a new planet. Discovering a new planet add the planet to the storage without any lord.
    - If planet already exists, fail with "Planet already discovered" message
  - `Claim` a known planet. Claiming means assigning the sender of the transaction as lord.
    - If planet isn't in the storage, fail with "Unknown planet cannot be claimed" message

> 📌 Option: you can unfold an option and providing a meaningful error with `Option.unopt_with_error(p_opt, "This planet does not exist") as planet`

> 📌 Casting: you can unfold an option and providing a meaningful error with `Option.unopt_with_error(p_opt, "This planet does not exist") as planet`

> 📌 Sender: you can know who sent a transaction to the contract with `Tezos.get_sender ()`

- use this script to compile: `npm run compile`
- compilation artefacts are in **build** folder, you can have a look at the `.tz` which is Michelson Code, the "byte code" for Tezos Virtual Machine. Easier to read than Java Bytecode, isn't it? But hopefuly we have higher language like LIGO to hack!

## Deploy our first contract

### Exercice 3: Configure a wallet

Wallets allow Dapp users to sign transactions on the Dapp without disclosing their private keys.

- Install [Temple Wallet](https://templewallet.com/) (browser extension)
- Create an address: this address will be use for development, write keep your wordlist safe... but prefer to use this address only for development purpose
- Select Ghostnet Testnet network: this is the rolling testnet for Tezos
- Go to [Marigold Faucet](https://faucet.marigold.dev/) to get some XTZ in order to be able to pay gas
- Copy your private key in [deploy/.env](deploy/.env)

### Exercice 4: Deploy the contract on Ghostnet

I provide you a deployment script made with [taquito](https://tezostaquito.io/)

- use this script to deply: `npm run deploy`

When you deployed the contract, you can see its address in your console (start with `KT1`)

Use Better Call Dev to explore your contract. Go to https://better-call.dev/ghostnet/<YOUR_CONTRACT_ADDRESS>

You can observe its operation, storage, code and more.

### Exercice 5: Interact with your contract

Go to https://better-call.dev/ghostnet/<YOUR_CONTRACT_ADDRESS>/interact

- Connect with Temple
- Discover two planets
- Claim one planet

## Improve our contract

### Exercice 6: Time to pay

Modify the contract to implement the following business rules:

- Planets have a default price of 1000 mutez
- After claiming a planets its price double
- Lords can "Destroy" their planets
