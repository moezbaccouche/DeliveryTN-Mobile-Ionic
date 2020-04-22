import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-rating",
  templateUrl: "./popover-rating.component.html",
  styleUrls: ["./popover-rating.component.scss"],
})
export class PopoverRatingComponent implements OnInit {
  @Input()
  public onclick = (rating) => {};

  @Input()
  public clientRating: number;

  starOneSelected = false;
  starTwoSelected = false;
  starThreeSelected = false;
  starFourSelected = false;
  starFiveSelected = false;

  rating = 0;

  constructor() {}

  ngOnInit() {
    console.log(this.clientRating);
    this.initRatingStars();
  }

  initRatingStars() {
    if (this.clientRating != 0) {
      switch (this.clientRating) {
        case 1:
          this.onStarOneClick();
          break;

        case 2:
          this.onStarTwoClick();
          break;

        case 3:
          this.onStarThreeClick();
          break;

        case 4:
          this.onStarFourClick();
          break;

        case 5:
          this.onStarFiveClick();
          break;
        default:
          break;
      }
    }
  }

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
