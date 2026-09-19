import { PartialType } from '@nestjs/swagger';
import { CreateTacticalActionDto } from './create-tactical-action.dto';

export class UpdateTacticalActionDto extends PartialType(CreateTacticalActionDto) {}
