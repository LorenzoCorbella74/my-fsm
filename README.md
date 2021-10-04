# my Finite State Machine library

![](https://img.shields.io/badge/type-JS_Library-brightgreen.svg "Project type")
![](https://img.shields.io/github/repo-size/LorenzoCorbella74/my-fsm "Repository size")
![](https://img.shields.io/github/package-json/v/LorenzoCorbella74/my-fsm)

A test library to study the possibilities of the "Finite State Machine" pattern.

## Documentation

```javascript
import SM from "./fsm";

// the object to manipulate
let data = {
  visible: true,
  changeVisibility: function (status) {
    this.visible = status;
  }
};

//
let fsm = new SM({
  init: "idle",
  transitions: [
    { name: "collect", from: ["idle", "cover"], to: "wander" },
    { name: "flee", from: "fight", to: "cover" },
    { name: "chase", from: ["wander", "idle"], to: "fight" }
  ],
  data: data,
  events: {
    onBeforeChase: function () {
      this.changeVisibility(false);
      console.log(
        `${this.currentState}: I 'm about to fight: visible ${this.visible}`
      );
    },
    onChase: function () {
      console.log(`${this.currentState}: I'm chasing the enemy"`);
    },
    onAfterChase: function () {
      this.changeVisibility(true);
      console.log(
        `${this.currentState}: I ended chasing: : visible ${this.visible}`
      );
    },
    onCollect: function () {
      console.log(`${this.currentState}: I'm wandering collecting powerups`);
    },
    onFlee: function () {
      console.log(
        `${this.currentState}: I'm low on energy and I escape from enemy`
      );
    },
    onLeaveWander: function () {
      console.log(`${this.currentState}: I 'm leaving the wander state`);
    },
    onEnterWander: function () {
      console.log(`${this.currentState}: I 'm now in a wander state`);
    },
    // debug
    onInvalidTransition: function (transition, from, to) {
      throw new Error("transition not allowed from that state");
    }
  }
});

console.log("All states: ", fsm.allStates());
console.log("All transitions: ", fsm.allTransitions());

fsm.chase();
console.log("is wander: ", fsm.is("wander"));

fsm.flee();
console.log('can go to "fight": ', fsm.can("fight"));

// override is not working !!!
fsm.onCollect = function () {
  console.log("onCollect revised");
};

// needs to be done manually
fsm.collect();
fsm.onCollect();

console.log("Allowed transitions: ", fsm.allowedTransitions());

fsm.chase();

console.log("Allowed transitions: ", fsm.allowedTransitions());
```

### Todo

- [ ] better events system

## Bugs

- Uhm...

## Built With

ES6 Javascript,

## Versioning

Versione 0.0.1

## License

This project is licensed under the ISC License.

