import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription, Observable } from "rxjs";

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
    // commented out code was the half made observable from scratch.
    // this.firstObsSubscription = interval(1000).subscribe(count => {
    //   console.log(count);
    // });

    // creating our custom observable.
    // when creating an observable from scratch we do it with the create method & the method always gets
    // as an argument an observer. This observer is used to either call .next() with any new updates,
    // .error() to thow any errors, or .complete() which notifies when the code you ran is complete.
    const customIntervalObservable = new Observable(observer => {
      let count = 0;
      setInterval(() => {
        // .next(count) will be triggered whenever the count variable is updated.
        observer.next(count);
        // setting up a coomplete signal for our observer.
        if (count === 2) {
          // once an obvservable is complete it no longer continues to emite values.
          observer.complete();
        }
        // creating a fake error to catch later on in the obervable below.
        if (count >= 3) {
          observer.error(new Error("Number can not go above 3!"));
        }
        count++;
      }, 1000);
    });

    // subscribing to our custom observable & saving this subscription into a private property to be able to
    // unsubscribe from the observable once we leave the component.
    this.firstObsSubscription = customIntervalObservable.subscribe(
      newData => {
        console.log(newData);
      },
      // catching any error thrown, and then running some code with it.
      // important to note that once an error is thrown from our observable that it no longer continues
      // and the entire flow of data stops.
      error => {
        console.log(error);
      },
      // handler function for completion doesn't take any arguments.
      // important to note that the completed handler does not go off id an error is thrown.
      () => {
        console.log("COMPLETE!");
      }
    );
  }

  // ngOnDestroy allows us to run a function upoun us leaving this specific component.
  ngOnDestroy() {
    // upon us leaving the home component we unsubscribe to the observable created above.
    // once we come back to this component the observable starts again from the beggining, not
    // from where it left.
    this.firstObsSubscription.unsubscribe();
  }
}
