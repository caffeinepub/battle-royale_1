import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type Position = {
    x : Float;
    y : Float;
    z : Float;
  };

  type PlayerState = {
    health : Int;
    position : Position;
    score : Nat;
  };

  module PlayerState {
    public func compare(left : PlayerState, right : PlayerState) : Order.Order {
      Nat.compare(left.score, right.score);
    };
  };

  let players = Map.empty<Principal, PlayerState>();

  public shared ({ caller }) func spawnPlayer(initialPosition : Position) : async () {
    if (players.containsKey(caller)) {
      Runtime.trap("Player already spawned");
    };
    let newState : PlayerState = {
      health = 100;
      position = initialPosition;
      score = 0;
    };
    players.add(caller, newState);
  };

  public shared ({ caller }) func updatePosition(newPosition : Position) : async () {
    let playerState = players.get(caller);
    switch (playerState) {
      case (null) { Runtime.trap("Player not found") };
      case (?state) {
        let updatedState = {
          state with
          position = newPosition;
        };
        players.add(caller, updatedState);
      };
    };
  };

  public shared ({ caller }) func takeDamage(amount : Int) : async () {
    let playerState = players.get(caller);
    switch (playerState) {
      case (null) { Runtime.trap("Player not found") };
      case (?state) {
        let newHealth = if (state.health - amount < 0) {
          0;
        } else {
          state.health - amount;
        };
        let updatedState = {
          state with
          health = newHealth;
        };
        players.add(caller, updatedState);
      };
    };
  };

  public query ({ caller }) func getPlayerState() : async PlayerState {
    switch (players.get(caller)) {
      case (null) { Runtime.trap("Player not found") };
      case (?state) { state };
    };
  };

  public query ({ caller }) func getAllPlayers() : async [PlayerState] {
    players.values().toArray().sort();
  };
};
