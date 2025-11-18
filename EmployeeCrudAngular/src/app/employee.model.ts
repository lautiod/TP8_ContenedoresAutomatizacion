export class Employee {
  constructor(
    public id: string,
    public name: string,
    public createdDate?: string // Asegúrate de que sea un string para evitar errores con `Date`
  ) {}
}
