import "./styles.css";
import SM from "./fsm";

let data = {
  visible: true,
  changeVisibility: function (status) {
    this.visible = status;
  }
};

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

// l'override non funziona !!!
fsm.onCollect = function () {
  console.log("onCollect revised");
};
fsm.collect();
// bisogna farla il run manualmente
fsm.onCollect();

console.log("Allowed transitions: ", fsm.allowedTransitions());

fsm.chase();

console.log("Allowed transitions: ", fsm.allowedTransitions());

document.getElementById("app").innerHTML = ``;
