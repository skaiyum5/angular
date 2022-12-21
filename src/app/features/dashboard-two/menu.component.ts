import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { IMenu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  @Input() menu: IMenu;
  submenu = false;

  currentUrl: string;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    this.listenRouting();
  }

  listenRouting() {
    this.router.events
      // .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((ev) => {
        this.currentUrl = this.router.url;

        if (ev instanceof NavigationEnd != ev instanceof NavigationStart) {
          this.submenu = false;
        }
      });
  }

  toggleSubmenu() {
    this.submenu = !this.submenu;
  }

  route(url: string) {
    this.router.navigate([url]);
  }
}
