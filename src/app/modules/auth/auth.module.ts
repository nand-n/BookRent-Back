import { Module, forwardRef } from "@nestjs/common";
import { BcryptService } from "./hashing/bcrypt.service";
import { HashingService } from "./hashing/hashing.service";
import { AuthenticationController } from "./authentication/authentication.controller";
import { AuthenticationService } from "./authentication/authentication.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule, JwtService } from "@nestjs/jwt";
import jwtConfig from "./config/jwt.config";
import { ConfigModule } from "@nestjs/config";
import { AccessTokenGuard } from "./authentication/guards/access-token.guard";
import { User } from "../users/entities/user.entity";
import { RolesGuard } from "./autherization/guards/roles.guard";
import { RefreshTokenIdsStorage } from "./authentication/refres-token-ids.storage";
import { RefreshToken } from "./authentication/entities/refres-token.entity";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([User , RefreshToken ]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => UsersModule),

  ],

  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    RefreshTokenIdsStorage,
    AccessTokenGuard,
    AuthenticationService,
    RolesGuard, 
    JwtService,
  ],
  controllers: [AuthenticationController],
  exports: [AccessTokenGuard, RolesGuard, JwtService],
})
export class AuthModule {}