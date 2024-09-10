import Hash "mo:base/Hash";

import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";

actor {
  type TaxPayer = {
    tid: Nat;
    firstName: Text;
    lastName: Text;
    address: Text;
  };

  stable var taxPayersEntries : [(Nat, TaxPayer)] = [];
  var taxPayers = HashMap.HashMap<Nat, TaxPayer>(10, Nat.equal, Nat.hash);

  system func preupgrade() {
    taxPayersEntries := Iter.toArray(taxPayers.entries());
  };

  system func postupgrade() {
    taxPayers := HashMap.fromIter<Nat, TaxPayer>(taxPayersEntries.vals(), 10, Nat.equal, Nat.hash);
    taxPayersEntries := [];
  };

  public func createTaxPayer(tid: Nat, firstName: Text, lastName: Text, address: Text) : async () {
    let taxPayer : TaxPayer = {
      tid = tid;
      firstName = firstName;
      lastName = lastName;
      address = address;
    };
    taxPayers.put(tid, taxPayer);
  };

  public query func getAllTaxPayers() : async [TaxPayer] {
    Iter.toArray(taxPayers.vals())
  };

  public query func searchTaxPayer(tid: Nat) : async ?TaxPayer {
    taxPayers.get(tid)
  };
}
