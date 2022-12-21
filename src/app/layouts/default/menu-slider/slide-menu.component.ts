import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { IMenu } from 'src/app/models/menu.model';

@Component({
  selector: 'app-slide-menu',
  templateUrl: './slide-menu.component.html',
  styleUrls: ['./slide-menu.component.css'],
})
export class SlideMenuComponent implements OnInit {
  @Output() currentMenu = new EventEmitter<IMenu>();
  @Input() menu: IMenu;
  menus: IMenu[] = [];
  submenu = false;

  currentUrl: string;
  key = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.activeMenu(true);
    this.listenRouting();
  }

  listenRouting() {
    this.router.events
      // .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((ev) => {
        this.activeMenu();

        if (ev instanceof NavigationEnd != ev instanceof NavigationStart) {
          this.submenu = false;
        }
      });
  }

  activeMenu(initial?: boolean) {
    this.currentUrl = this.router.url;
    this.menus = JSON.parse(localStorage.getItem('menu'));

    this.menus?.forEach((menu) => {
      if (menu.url) {
        if (menu.url === this.currentUrl) {
          this.key = menu.key;
          if (initial) this.currentMenu.emit(menu);
        }
      } else {
        if (menu.children.some((m) => m.url === this.currentUrl)) {
          this.key = menu.key;
          if (initial) this.currentMenu.emit(menu);
        }
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
