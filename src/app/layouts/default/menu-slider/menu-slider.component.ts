import { Component, Input, OnInit } from '@angular/core';
import { IMenu } from 'src/app/models/menu.model';
declare const $: any;

@Component({
  selector: 'app-menu-slider',
  templateUrl: './menu-slider.component.html',
  styleUrls: ['./menu-slider.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class MenuSliderComponent implements OnInit {
  // @HostListener('window:resize')
  innerWidth: number;
  
  onResize() {
    this.innerWidth = window.innerWidth;
  }

  @Input() menus: IMenu[] = [];
  menuChunk: IMenu[][] = [];

  constructor() {
    this.onResize();
  }

  ngOnInit(): void {
    if(this.innerWidth >= 990) {
      while (this.menus?.length) {
        this.menuChunk.push(this.menus.splice(0, 8));
      }
    }
    if(this.innerWidth < 990 && this.innerWidth >= 700) {
      while (this.menus?.length) {
        this.menuChunk.push(this.menus.splice(0, 5));
      }
    } 
    if(this.innerWidth < 700) {
      while (this.menus.length) {
        this.menuChunk.push(this.menus.splice(0, 4));
      }
    }
  }

  activeMenu(menu: any) {
    if(this.menuChunk[0].some(m => m.key === menu.key)) {
      $("#menuSlider").carousel(0);
    } else if (this.menuChunk[1].some(m => m.key === menu.key)) {
      $("#menuSlider").carousel(1);
    }
  }
}
