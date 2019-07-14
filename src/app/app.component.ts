import { Component, OnInit, OnDestroy } from "@angular/core";
import { UserService } from "./user.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, OnDestroy {
  userActivated = false;
  private activatedSub: Subscription;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // subscribing to an event emition when the data changes from the users component.
    this.activatedSub = this.userService.activatedEmitter.subscribe(
      didActivate => {
        this.userActivated = didActivate;
      }
    );
  }

  ngOnDestroy() {
    this.activatedSub.unsubscribe();
  }
}
