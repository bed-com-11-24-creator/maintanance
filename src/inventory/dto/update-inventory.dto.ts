import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiPropertyOptional({ example: 'Dell Laptop' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Equipment' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ example: 'Lab A' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'In Stock' })
  @IsOptional()
  @IsString()
  status?: string;
}