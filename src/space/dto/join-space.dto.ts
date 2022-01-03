import { IsNotEmpty, IsNumber } from 'class-validator';

export class JoinSpaceData {
  @IsNumber()
  @IsNotEmpty()
  readonly spaceIdx: number;
}
