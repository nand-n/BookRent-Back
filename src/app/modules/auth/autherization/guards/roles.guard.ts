import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../../../users/users.service";
import { Role } from "../../../users/enums/role.enum";
import { ROLE_KEY } from "../decorators/role.decorator";
import { REQUEST_USER } from "../../auth.constants";
import { Request } from "express";
import jwtConfig from "../../config/jwt.config";
import { ConfigType } from "@nestjs/config";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY , [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!contextRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token,{
        secret: this.jwtConfiguration.secret,
      });
      const userId = payload.sub;
      const user = await this.usersService.findOne(userId);

      if (!user || !user.role) {
        return false;
      }

      request[REQUEST_USER] = user;

      return contextRoles.some((role) => user.role === role);
    } catch (err) {
      console.error('Error verifying token or retrieving user:', err); // Debugging log
      throw new UnauthorizedException('Token not valid');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [_, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
