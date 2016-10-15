import { Component } from "@angular/core";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    template: `
    <h1>{{title}}</h1>
    hello123367<br>
    world2233<br>
    <input [(ngModel)]="title" placeholder="name" />
    <button type="submit" class="btn btn-default">Submit</button>
    `
})
export class AppComponent {
  title = 'Angular 2 sample application';

}