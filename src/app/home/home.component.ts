import { Component, OnInit, OnDestroy } from "@angular/core";
import { interval, Subscription, Observable } from "rxjs";
import { map, filter } from "rxjs/operators";

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
        if (count === 8) {
          // once an obvservable is complete it no longer continues to emite values.
          observer.complete();
        }
        // creating a fake error to catch later on in the obervable below.
        if (count >= 10) {
          observer.error(new Error("Number can not go above 3!"));
        }
        count++;
      }, 1000);
    });

    // subscribing to our custom observable & saving this subscription into a private property to be able to
    // unsubscribe from the observable once we leave the component.
    this.firstObsSubscription = customIntervalObservable
      // --------------------------------------------
      /* Here inbetween the commented dashes is our Operator that always starts with the .pipe() method.
        The Operator takes an unlimited amout of operator methods from rxjs as arguments and takes the data
        send from our observable and can run some logic with it.
        Our observer then subscribes to this new data being passed in from the operator. */
      .pipe(
        // Filter emits values that pass the provided condition. For example in the condition below
        // we filter for only even number as only pass those even number to the next operator
        // which in this case is the map() operator.
        filter((num: number) => {
          return num % 2 === 0;
        }),
        /* cool thing to note is that you can name and rename the incoming data into your operator to best
         suite your operator. For example in the filter operator above I named my incoming data to be num,
         b/c it contained all my odd and even numbers. But in the case of my map function, I names the data
         comming in to be evenNum since I filtered out all the odd numbers with the filer operator. */
        map((evenNum: number) => {
          return `Round: ${evenNum}`;
        })
      )
      // --------------------------------------------
      .subscribe(
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
