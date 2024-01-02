import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-ath.guard';
import { BugsService } from '../../use-cases/bugs.service';
import { CreateBugDto, UpdateBugDto } from '../dto/bug.dto';

@UseGuards(JwtAuthGuard)
@Controller('bugs')
export class BugsController {
  constructor(private readonly bugsService: BugsService) {}

  @Post()
  async create(@Body() bug: CreateBugDto, @Req() req: any) {
    try {
      return await this.bugsService.create(bug, req.user.id);
    } catch (error) {
      throw new HttpException('Error creating bug', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAllByUser(@Req() req: any) {
    try {
      return await this.bugsService.findAllByUser(req.user.id);
    } catch (error) {
      throw new HttpException('Error getting bugs', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.bugsService.findOne(id);
    } catch (error) {
      throw new HttpException('Error getting bug', HttpStatus.NOT_FOUND);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() bug: UpdateBugDto) {
    return await this.bugsService.update(id, bug);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.bugsService.delete(id);
  }
}
