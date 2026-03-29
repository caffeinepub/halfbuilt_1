import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Int "mo:core/Int";
import Order "mo:core/Order";

actor {
  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };
  };

  let projectMap = Map.empty<Nat, Project>();
  let contactLinks = Map.empty<Nat, Text>();
  var idCounter = 1;
  module ProjectStatus {
    public type ProjectStatus = {
      #pending;
      #approved;
      #rejected;
    };
  };
  public type Project = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    price : Float;
    status : ProjectStatus.ProjectStatus;
    submittedBy : Principal;
    createdAt : Int;
  };
  
  public type UserProfile = {
    name : Text;
  };
  
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  
  let userProfiles = Map.empty<Principal, UserProfile>();
  
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };
  
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };
  
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
  
  public shared ({ caller }) func submitProject(name : Text, description : Text, category : Text, price : Float, contactLink : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit projects");
    };
    let project : Project = {
      id = idCounter;
      name;
      description;
      category;
      price;
      status = #pending;
      submittedBy = caller;
      createdAt = Time.now();
    };
    projectMap.add(idCounter, project);
    contactLinks.add(idCounter, contactLink);
    idCounter += 1;
    idCounter - 1;
  };
  
  public query ({ caller }) func getApprovedProjects() : async [Project] {
    projectMap.values().toArray().filter(func(p) { p.status == #approved }).sort();
  };
  
  public query ({ caller }) func getPendingProjects() : async [Project] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view pending projects");
    };
    projectMap.values().toArray().filter(func(p) { p.status == #pending }).sort();
  };
  
  public shared ({ caller }) func unlockContact(id : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Sign in to unlock contact info");
    };
    switch (contactLinks.get(id)) {
      case (null) { Runtime.trap("Contact info not found") };
      case (?link) { link };
    };
  };
  
  public shared ({ caller }) func approveProject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can approve projects");
    };
    switch (projectMap.get(id)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?project) {
        let updatedProject : Project = {
          project with
          status = #approved;
        };
        projectMap.add(id, updatedProject);
      };
    };
  };
  
  public shared ({ caller }) func rejectProject(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can reject projects");
    };
    switch (projectMap.get(id)) {
      case (null) {
        Runtime.trap("Project not found");
      };
      case (?project) {
        let updatedProject : Project = {
          project with
          status = #rejected;
        };
        projectMap.add(id, updatedProject);
      };
    };
  };
  
  public query ({ caller }) func getMyProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their projects");
    };
    projectMap.values().toArray().filter(func(p) { Principal.equal(p.submittedBy, caller) }).sort();
  };
};
