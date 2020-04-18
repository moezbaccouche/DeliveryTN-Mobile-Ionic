import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-product-images-slides",
  templateUrl: "./product-images-slides.component.html",
  styleUrls: ["./product-images-slides.component.scss"],
})
export class ProductImagesSlidesComponent implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  constructor() {}

  ngOnInit() {}
}
