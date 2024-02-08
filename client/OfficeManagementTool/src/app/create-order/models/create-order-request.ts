export class CreateOrderRequest
{
    officeId!: number;
    email!: string

    constructor(id: number, mail: string) {
        this.officeId = id;
        this.email = mail;
    }
}