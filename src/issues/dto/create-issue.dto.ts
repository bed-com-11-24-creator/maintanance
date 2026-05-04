import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { IssueCategory, IssueUrgency } from '../../common/enums/issue.enums';

export class CreateIssueDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  block!: string;

  @IsString()
  @IsNotEmpty()
  roomNumber!: string;

  @IsEnum(IssueCategory)
  @IsOptional()
  category?: IssueCategory;

  @IsEnum(IssueUrgency)
  @IsOptional()
  urgency?: IssueUrgency;
}
