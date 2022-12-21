import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
declare const $: any;

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css'],
})
export class ImageSliderComponent implements OnInit {
  imageSlide1: string = `assets/images/banner_1.jpg`;
  imageSlide2: string = `assets/images/banner_4.jpg`;
  // imageSlide3: string = `assets/images/image3.png`;

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    $('#imageSlider').carousel();
  }
}
