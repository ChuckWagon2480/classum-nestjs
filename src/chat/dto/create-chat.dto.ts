import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @IsNumber()
  @IsNotEmpty()
  readonly postIdx: number;

  @IsNumber()
  @IsOptional()
  readonly parentIdx: number;

  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
