import equal from 'deep-equal'
import { Wrapper } from './fixtures'
import { throwError, isValidSelector } from './utils'

export default function () {
  const proto = Wrapper.prototype

  /**
   * An alias for `contains`
   */
  proto.has = proto.contains

  /**
   * Assert that the wrapper contains all provided selectors.
   */
  proto.containsAll = proto.hasAll = function () {
    for (let selector of arguments) {
      if (!this.contains(selector)) {
        return false
      }
    }
    return true
  }

  /**
   * Assert that the wrapper contains any of the provided selectors.
   */
  proto.containsAny = proto.hasAny = function () {
    for (let selector of arguments) {
      if (this.contains(selector)) {
        return true
      }
    }
    return false
  }

  /**
   * Assert that the wrapper contains none of the provided selectors.
   */
  proto.containsNone = proto.hasNone = proto.doesntHaveAny = function () {
    return !this.containsAny(...arguments)
  }

  /**
   * Assert that the wrapper's element has the provided class name(s).
   */
  proto.hasClass = proto.hasClasses = function (...names) {
    for (let name of names) {
      if (!this.classes().includes(name)) {
        return false
      }
    }
    return true
  }

  /**
   * Assert that the wrapper's element has the provided attribute.
   */
  proto.hasAttribute = function (key, value) {
    return this.attributes()[key] === value
  }

  /**
   * Assert that the wrapper has the provided prop.
   */
  proto.hasProp = function (key, value) {
    if (!this.isVueComponent) {
      throwError('wrapper.hasProps must be called on a Vue instance')
    }
    return this.props()[key] === value
  }

  /**
   * An alias for attributes().id, because we have wrapper.classes().
   */
  proto.id = function () {
    return this.attributes().id
  }

  /**
   * Proxy the most common event triggers.
   */
  ;['click', 'dblclick', 'submit', 'input', 'focus', 'blur'].forEach(eventName => {
    proto[eventName] = function () {
      if (arguments.length === 0) {
        return this.trigger(eventName)
      }

      if (!isValidSelector(arguments[0])) {
        // the first argument must be an options object
        if (typeof (arguments[0]) !== 'object') {
          throwError(`first argument of ${eventName}() must be a valid selector or an options object`)
        }
        return this.trigger(eventName, arguments[0])
      }

      // the first argument is a valid selector.
      // we find() it and trigger the event, optionally with the options object.
      return arguments.length === 1
        ? this.find(arguments[0]).trigger(eventName)
        : this.find(arguments[0]).trigger(eventName, arguments[1])
    }
  })

  /**
   * Set the contained element's value and return the wrapper, useful for chaining.
   * e.g. wrapper.setValue('foo').click()
   */
  proto.setValue = function (value) {
    this.element.value = value
    return this
  }

  /**
   * Get the contained element's value.
   */
  proto.getValue = function () {
    return this.element.value
  }

  /**
   * Allow getting/setting contained element value directly via wrapper.value.
   */
  Object.defineProperty(proto, 'value', {
    get () {
      return this.getValue()
    },
    set (value) {
      this.setValue(value)
    },
    configurable: true
  })

  /**
   * Assert that an event and optionally its value have been emitted.
   */
  proto.hasEmitted = function () {
    if (arguments.length === 1) {
      return Object.keys(this.emitted()).includes(arguments[0])
    }

    if (arguments.length === 2) {
      return Object.keys(this.emitted()).includes(arguments[0]) &&
        equal(this.emitted()[arguments[0]], [[arguments[1]]])
    }
  }
}
