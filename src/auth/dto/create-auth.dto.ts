export class CreateAuthDto {}

export class LoginDto {
  email: string;
  password: string;
}
export interface JwtPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}