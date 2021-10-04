export default class SM {
  constructor(conf) {
    if (!conf) {
      throw new Error("configuration obj is required!");
    }
    this.states = new Set();
    this.events = conf.events;
    this.transitionsAsA = conf.transitions;
    this.transitions = conf.transitions.reduce(
      (acc, item) => ({
        ...acc,
        [item.name]: item
      }),
      {}
    );
    // get states
    conf.transitions.forEach((t) => {
      if (Array.isArray(t.from)) {
        t.from.forEach((element) => {
          this.states.add(element);
        });
      } else {
        this.states.add(t.from);
      }
      this.states.add(t.to);
    });

    if (this.states.has(conf.init)) {
      this.currentState = conf.init;
      console.log(`Init state is "${this.currentState}"`);
    } else {
      throw new Error("Init state is not valid!");
    }
    this._buildTransitions();
    this._buildEvents();
    // proxy the data obj to this (each istance has its own...with IIFE)
    Object.assign(this, (() => conf.data)());
  }

  _getStateName(t_name) {
    return t_name.charAt(0).toUpperCase() + t_name.substr(1);
  }

  _checkFrom(current, t) {
    if (Array.isArray(t.from)) {
      return t.from.includes(current);
    } else {
      return current === t.from;
    }
  }

  performTtansition(t) {
    if (t.name in this.transitions && this._checkFrom(this.currentState, t)) {
      // ON LEAVE STATE
      let oldState = this._getStateName(this.currentState);
      if ("onLeave" + oldState in this.events) {
        this.events["onLeave" + oldState].call(this);
      }
      // setting the new state
      this.currentState = t.to;
      console.log(`Current state is now set on "${this.currentState}"`);
      let stateName = this._getStateName(t.name);
      // BEFORE TRANSITION
      if ("onBefore" + stateName in this.events) {
        this.events["onBefore" + stateName].call(this);
      }
      // ON TRANSITION
      if ("on" + stateName in this.events) {
        this.events["on" + stateName].call(this);
      }
      // ON ENTER STATE
      let newState = this._getStateName(this.currentState);
      if ("onEnter" + newState in this.events) {
        this.events["onEnter" + newState].call(this);
      }
      // AFTER TRANSITION
      if ("onAfter" + stateName in this.events) {
        this.events["onAfter" + stateName].call(this);
      }
    } else {
      if ("onInvalidTransition" in this.events) {
        this.events["onInvalidTransition"].call(this);
      }
      console.log(
        `Current state "${this.currentState}" does not foresee a transition to "${t.to}"`
      );
    }
  }

  _buildTransitions() {
    Object.keys(this.transitions).forEach((key) => {
      this[key] = this.performTtansition.bind(this, this.transitions[key]);
    });
  }

  _buildEvents() {
    Object.keys(this.events).forEach((method) => {
      this[method] = this.events[method].bind(this);
    });
  }

  // return true if state s is the current state
  is(s) {
    return this.currentState === s;
  }

  // return true if transition t can occur from the current state
  can(transition) {
    return (
      transition.name in this.transitions &&
      this._checkFrom(this.currentState, transition)
    );
  }

  // return true if transition t cannot occur from the current state
  cannot(t) {
    return !this.can(t);
  }

  // return list of transitions that are allowed from the current state
  allowedTransitions() {
    return this.transitionsAsA
      .filter((t) => this._checkFrom(this.currentState, t))
      .map((e) => e.name);
  }

  // return list of all possible transitions
  allTransitions() {
    return Object.keys(this.transitions).map(
      (transition_name) => transition_name
    );
  }

  //  - return list of all possible states
  allStates() {
    return [...this.states];
  }
}
