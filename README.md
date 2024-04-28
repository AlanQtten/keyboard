# keyboard

## Description

quickly bind multiple-key keyboard event

## Demo

```ts
keyboard()
  .ctrl()
  .letter('s')
  .listen(() => {
    console.log(`saving...`)
  })
```

## Option

#### maxTime

specific listener call max time

```ts
keyboard({ maxTime: 5 })
  .ctrl()
  .letter('s')
  .listen(() => {
    console.log(`saving...`)
  })
```

#### preventDefault

whether to prevent `keydown` and `keyup` event on `document`

```ts
keyboard({ preventDefault: 5 })
  .ctrl()
  .letter('F')
  .listen(() => {
    console.log(`searching...`)
  })
```
## Api

#### letter

```ts
keyboard()
  .letter('a')
  .letter('b')
  .listen(() => {
    console.log('you press a + b...')
  })
```

#### ctrl
> .alt(), .command(), .shift() as same


```ts
import { Position } from 'keyboard'

keyboard()
  .ctrl(Position.left)
  .letter('a')
  .listen(() => {
    console.log('you press left ctrl + a...')
  })

keyboard()
  .ctrl(Position.right)
  .letter('a')
  .listen(() => {
    console.log('you press right ctrl + a...')
  })

keyboard()
  .ctrl()
  .letter('a')
  .listen(() => {
    console.log('you press left or right ctrl + a...')
  })
```

#### getCallTime

```ts
keyboard()
  .letter('a')
  .letter('b')
  .listen((e) => {
    console.log(`you press a + b ${e.getCallTime()} times...`)
  })
```
