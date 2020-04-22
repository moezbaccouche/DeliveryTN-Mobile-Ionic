import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-rating",
  templateUrl: "./popover-rating.component.html",
  styleUrls: ["./popover-rating.component.scss"],
})
export class PopoverRatingComponent implements OnInit {
  @Input()
  public onclick = (rating) => {};

  starOneSelected = false;
  starTwoSelected = false;
  starThreeSelected = false;
  starFourSelected = false;
  starFiveSelected = false;

  rating = 0;

  constructor() {}

  ngOnInit() {}

  onStarOneClick() {
    this.starOneSelected = true;

    this.starTwoSelected = false;
    this.starThreeSelected = false;
    this.starFourSelected = false;
    this.starFiveSelected = false;

    this.rating = 1;
  }
  onStarTwoClick() {
    this.starOneSelected = true;
    this.starTwoSelected = true;

    this.starThreeSelected = false;
    this.starFourSelected = false;
    this.starFiveSelected = false;

    this.rating = 2;
  }
  onStarThreeClick() {
    this.starOneSelected = true;
    this.starTwoSelected = true;
    this.starThreeSelected = true;

    this.starFourSelected = false;
    this.starFiveSelected = false;

    this.rating = 3;
  }
  onStarFourClick() {
    this.starOneSelected = true;
    this.starTwoSelected = true;
    this.starThreeSelected = true;
    this.starFourSelected = true;

    this.starFiveSelected = false;

    this.rating = 4;
  }
  onStarFiveClick() {
    this.starOneSelected = true;
    this.starTwoSelected = true;
    this.starThreeSelected = true;
    this.starFourSelected = true;
    this.starFiveSelected = true;

    this.rating = 5;
  }

  onConfirmRating() {
    this.onclick(this.rating);
  }
}
