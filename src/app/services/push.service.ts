import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PushService {
  constructor(private http: HttpClient) {}

  sendNotification(title: string, msg: string, playersIds: string[]) {
    let httpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "1d0cf02e-3eda-4ff5-b9a1-74c3ccf33dfb",
        include_player_ids: playersIds,
        headings: {
          fr: title,
          en: title,
        },
        contents: {
          fr: msg,
          en: msg,
        },
        android_accent_color: "FF6E1C1C",
      },
      options
    );
  }
}
