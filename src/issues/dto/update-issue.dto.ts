import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { IssueStatus, IssueUrgency, IssueCategory } from '../../common/enums/issue.enums';

export class UpdateIssueDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IssueStatus)
  @IsOptional()
  status?: IssueStatus;

  @IsEnum(IssueUrgency)
  @IsOptional()
  urgency?: IssueUrgency;

  @IsEnum(IssueCategory)
  @IsOptional()
  category?: IssueCategory;

  @IsNumber()
  @IsOptional()
  workerId?: number; // For assigning a technician
}
