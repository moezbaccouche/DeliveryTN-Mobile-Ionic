export class Location {
  constructor(
    public id: number,
    public address: string,
    public city: string,
    public zipCode: number,
    public long: number,
    public lat: number
  ) {}
}
