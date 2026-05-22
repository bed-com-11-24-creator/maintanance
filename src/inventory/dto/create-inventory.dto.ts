import { IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryDto {
  @ApiProperty({ example: 'Dell Laptop' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Equipment' })
  @IsString()
  type!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  quantity!: number;

  @ApiProperty({ example: 'Lab A' })
  @IsString()
  location!: string;

  @ApiPropertyOptional({ example: 'In Stock' })
  @IsOptional()
  @IsString()
  status?: string;
}