import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";

@Component({template: '<h1>Auto Closable component</h1>'})
export class AutoClosableComponent implements OnDestroy {
    private subscriptions: Subscription[] = [];

    public manage(subscription: Subscription) {
        this.subscriptions.push(subscription);
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe())
    }
}