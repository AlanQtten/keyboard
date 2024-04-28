import { describe, it, vi, expect } from 'vitest'
import { JSDOM } from 'jsdom'
import keyboard from '../index'

const dom = new JSDOM()
const document = dom.window.document

global.document = document

const keyboardEvent = (key: string | string[], keyType: 'keydown' | 'keyup') => {
  if(Array.isArray(key)) {
    key.forEach(k => {
      document.dispatchEvent(new KeyboardEvent(keyType, { key: k }))
    })
    return
  }

  document.dispatchEvent(new KeyboardEvent(keyType, { key }))
}

const keydown = (key: string | string[]) => keyboardEvent(key, 'keydown')
const keyup = (key: string | string[]) => keyboardEvent(key, 'keyup')
const keypress = (key: string | string[], frequency = 1) => {
  for(let i = 0; i < frequency; i++) {
    keydown(key)
    keyup(key)
  }
}

describe('keyboard', () => {
  it('should work', () => {
    const mockFn = vi.fn()

    keyboard()
      .letter('a')
      .letter('b')
      .listen(mockFn)

    keypress(['a', 'b'], 4)

    expect(mockFn).toHaveBeenCalledTimes(4)
  })

  it('should work when `maxTime` api', () => {
    const mockFnA = vi.fn()
    const mockFnB = vi.fn()

    keyboard({ maxTime: 1 })
      .letter('a')
      .letter('b')
      .listen(mockFnA)
    keyboard({ maxTime: 5 })
      .letter('a')
      .letter('b')
      .listen(mockFnB)

    keypress(['a', 'b'], 10)

    expect(mockFnA).toHaveBeenCalledTimes(1)
    expect(mockFnB).toHaveBeenCalledTimes(5)
  })

  it('should break chain when keyup in middle letter', () => {
    const mockFn = vi.fn()

    keyboard()
      .letter('a')
      .letter('b')
      .letter('c')
      .letter('d')
      .listen(mockFn)

    keydown(['a', 'b', 'c', 'd'])
    keyup('b')

    keydown(['a', 'b', 'c', 'd'])

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should unique with every keyboard()', () => {
    const mockFnA = vi.fn()
    const mockFnB = vi.fn()

    keyboard({ maxTime: 1 })
      .letter('a')
      .letter('b')
      .listen(mockFnA)

    keyboard()
      .letter('a')
      .letter('b')
      .listen(mockFnB)

    keypress(['a', 'b'])
    keydown(['a', 'b'])

    expect(mockFnA).toHaveBeenCalledTimes(1)
    expect(mockFnB).toHaveBeenCalledTimes(2)
  })

  it('should return callTime while call getCallTime()', () => {
    const mockFn = vi.fn()

    const keyboardInstance = keyboard()
      .letter('a')
      .letter('b')
      .letter('c')
      .listen(mockFn)

    keypress(['a', 'b', 'c'], 3)
    expect(keyboardInstance.getCallTime()).toBe(3)

    keypress(['a', 'b', 'c'], 3)
    expect(keyboardInstance.getCallTime()).toBe(6)
  })
})