import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/autherization/decorators/role.decorator';
import { Role } from './enums/role.enum';
import { AccessTokenGuard } from '../auth/authentication/guards/access-token.guard';
import { REQUEST_USER } from '../auth/auth.constants';
import { RolesGuard } from '../auth/autherization/guards/roles.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.Admin)
  @UseGuards(AccessTokenGuard)
  async findAll(
    @Query() options: IPaginationOptions,
    @Query('orderBy') orderBy = 'id',
    @Query('orderDirection') orderDirection: 'ASC' | 'DESC' = 'DESC',
  ): Promise<Pagination<User>> {
    return this.usersService.findAll(options, orderBy, orderDirection);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }


  @Patch(':id/assign-role')
  @Roles(Role.SuperAdmin)
  @UseGuards(AccessTokenGuard)
  async assignRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Req() req: Request,
  ) {
    const currentUser = req[REQUEST_USER] as User;
    return this.usersService.assignRole(id, role, currentUser);
    
  }

  // @Patch(':id/permissions')
  // @Roles(Role.SuperAdmin)
  // async updatePermissions(
  //   @Param('id') id: string,
  //   @Body('permissions') permissions: PermissionType[],
  //   @Req() req: Request,
  // ) {
  //   const currentUser = req.user as User;
  //   return this.usersService.updatePermissions(id, permissions, currentUser);
  // }
}
