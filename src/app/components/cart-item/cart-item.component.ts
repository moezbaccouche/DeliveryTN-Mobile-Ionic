import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-cart-item",
  templateUrl: "./cart-item.component.html",
  styleUrls: ["./cart-item.component.scss"],
})
export class CartItemComponent implements OnInit {
  @Input() productName: string;
  @Input() productImageBase64: string;
  @Input() productTotalPrice: string;
  @Input() productAmount: string;
  @Input() productId: number;

  constructor() {}

  ngOnInit() {}
}
