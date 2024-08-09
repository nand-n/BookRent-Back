import {
    Injectable,
    OnApplicationBootstrap,
    OnApplicationShutdown,
  } from "@nestjs/common";
  import { InjectRepository } from "@nestjs/typeorm";
  import { Repository } from "typeorm";
  import { InvalidateRefreshTokenError } from "./errors/invalidate-refresh-toke.error";
import { RefreshToken } from "./entities/refres-token.entity";
  
  @Injectable()
  export class RefreshTokenIdsStorage  {
    constructor(
      @InjectRepository(RefreshToken)
      private readonly refreshTokenRepository: Repository<RefreshToken>
    ) {}
  
    async insert(userId: string, tokenId: string): Promise<void> {
      const refreshToken = this.refreshTokenRepository.create({ userId, tokenId });
      await this.refreshTokenRepository.save(refreshToken);
    }
  
    async validate(userId: string, tokenId: string): Promise<boolean> {
      const refreshToken = await this.refreshTokenRepository.findOne({ where: { userId, tokenId } });
      if (!refreshToken) {
        throw new InvalidateRefreshTokenError();
      }
      return true;
    }
  
    async invalidate(userId: string): Promise<void> {
      await this.refreshTokenRepository.delete({ userId });
    }
  }
  