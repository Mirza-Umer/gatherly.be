export class CreateUserDto {
  firstName: string;
  lastName:string;
  email: string;
  Dob: Date;
  gender: 'male' | 'female' | 'custom';
  password: string;
  age: number;
  phone: string;
}