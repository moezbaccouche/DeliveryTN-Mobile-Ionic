export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public imageBase64: string,
    public unit: string,
    public category: string
  ) {}
}
