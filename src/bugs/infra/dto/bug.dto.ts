import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBugDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly description?: string;
  @IsOptional()
  @IsString({ each: true })
  readonly tags?: string[];
  @IsOptional()
  @IsString({ each: true })
  readonly bugImages?: string[];
  @IsOptional()
  @IsString()
  readonly bugFix?: string;
  @IsOptional()
  @IsString({ each: true })
  readonly fixLinks?: string[];
  @IsOptional()
  @IsString({ each: true })
  readonly fixImages?: string[];
}

export class UpdateBugDto extends PartialType(CreateBugDto) {}
