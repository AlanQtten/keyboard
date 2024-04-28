type Options = {
  maxTime?: number
  preventDefault?: boolean
}

enum Position {
  left = 'left',
  right = 'right',
  both = 'both',
}

type Key = {
  key: string,
  position?: Position,
}

const IS_DEV = process.env.NODE_ENV === 'development'

class Keyboard {
  private __keys__: Key[] = []
  private __call_time__ = 0
  private __callback__ = null
  private __options__: Options
  private __step__ = 0
  private __keydownListener__ = null
  private __keyupListener__ = null
  
  constructor(options: Options) {
    this.__options__ = Object.assign({
      maxTime: Infinity,
      preventDefault: false,
    }, options)
  }

  protected triggerCallback() {
    this.__call_time__ ++
    if(this.__call_time__ > this.__options__.maxTime) {
      this.destroy()
      return
    }
    this.__callback__(this)
  }

  protected destroy() {
    document.removeEventListener('keydown', this.__keydownListener__)
    document.removeEventListener('keyup', this.__keyupListener__)
  }

  protected keyCheck(e: KeyboardEvent, key: Key) {
    const _key = e.key.toUpperCase()

    if(!key.position || key.position === Position.both) {
      return _key === key.key
    }

    if(key.position === Position.left) {
      return _key === key.key && e.location === 1
    }

    if(key.position === Position.right) {
      return _key === key.key && e.location === 2
    }
  }

  protected keydownListener(e: KeyboardEvent) {
    if(this.keyCheck(e, this.__keys__[this.__step__])) {
      this.__step__ ++

      if(this.__step__ === this.__keys__.length - 1) {
        this.triggerCallback()
      }
    }

    if(this.__options__.preventDefault) {
      e.preventDefault()
    }
  }

  protected keyupListener(e: KeyboardEvent) {
    const indexOfKey = this.__keys__.findIndex(key => this.keyCheck(e, key))

    if(this.__options__.preventDefault) {
      e.preventDefault()
    }

    if(indexOfKey === -1) {
      return
    }

    if(indexOfKey !== -1) {
      this.__step__ = 0
    }
  }

  protected isListening() {
    return !!this.__callback__
  }

  public listen(callback: (keyboardInstance: Keyboard) => void) {
    if(IS_DEV && this.__keys__.length === 0) {
      console.warn(`you haven't bypass a key`)
      return this
    }

    if(IS_DEV && this.__keys__.length === 1) {
      console.warn(`if you only need listen to one key, use document.addEventListener('keydown', ...) instead`)
      return this
    }

    this.__callback__ = callback

    document.addEventListener('keydown', this.__keydownListener__ = this.keydownListener.bind(this))
    document.addEventListener('keyup', this.__keyupListener__ = this.keyupListener.bind(this))
    return this
  }

  public shift(position: Position) { return this.letter('SHIFT', position) }
  public command(position: Position) { return this.letter('META', position) }
  public ctrl(position: Position) { return this.letter('CONTROL', position) }
  public alt(position: Position) { return this.letter('ALT', position) }

  public letter(letter: string, position: Position = Position.both) {
    if(this.isListening()) {
      return this
    }
    
    this.__keys__.push({
      key: letter.toUpperCase(),
      position
    })
    return this
  }

  public getCallTime() {
    return this.__call_time__
  }
}

const keyboard = function (options?: Options) {
  return new Keyboard(options)
}

export default keyboard
export { Keyboard, Position }