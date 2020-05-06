import { Location } from "./location.model";

export class Client {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public dateOfBirth: Date,
    public phone: string,
    public email: string,
    public imageBase64: string,
    public location: Location
  ) {}
}
