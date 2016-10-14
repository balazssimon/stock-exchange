import { Component } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    hello<br>
    world<br>
    <input [(ngModel)]="title" placeholder="name" />

    `,
    styleUrls: ['app.component.css'],
})
export class AppComponent {
  title = 'Angular 2 sample application';

}