import { Matches } from 'class-validator';

export class FindIdParam {
  @Matches(/^[1-9]\d*$/)
  id: string;
}
