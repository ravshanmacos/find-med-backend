import { IsUUID } from 'class-validator';

export class AssignWorkplaceDto {
  @IsUUID()
  workplaceId: string;
}
