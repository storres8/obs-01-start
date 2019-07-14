import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor() {}

  activatedEmitter = new EventEmitter<boolean>();
}
