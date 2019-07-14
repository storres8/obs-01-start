import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, OnDestroy {
  // we create this private property to store our subscription which we can then have access to
  // thorughout the rest of the component.
  // By storing it in a property we can then reference the subscription later in ngOnDestroy so that we may
  // unsubscribe from the observable when we leave this compnent.
  private firstObsSubscription: Subscription;

  constructor() {}

  ngOnInit() {
    this.firstObsSubscription = interval(1000).subscribe(count => {
      console.log(count);
    });
  }

  // ngOnDestroy allows us to run a function upoun us leaving this specific component.
  ngOnDestroy() {
    // upon us leaving the home component we unsubscribe to the observable created above.
    this.firstObsSubscription.unsubscribe();
  }
}
