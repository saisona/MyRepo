/**
 * Created by projim on 19/06/2017.
 */

export class User {
  private createdAt : any;
  private lastLoginAt : number;
  private localId : any;

  constructor(usr : any) {
    this.createdAt = usr.createdAt;
    this.lastLoginAt = usr.lastLoginAt;
    this.localId = usr.localId;
    console.log(usr);
  }

  toString() {
    return `User => ${this.localId} has been created at ${this.createdAt} and logged the last time at ${this.lastLoginAt};`
  }
}
