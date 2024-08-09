import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RolesGuardService implements NestMiddleware {
    
    use(req: Request, res: Response, next: NextFunction) {
        console.log(req.user , 'req.user');

        if (req.user && req.user === 'player') {
            next(); // User is admin, proceed to the next middleware or controller
        } else {
            throw new UnauthorizedException('Unauthorized access'); // User is not admin, throw an unauthorized exception
        }
    }
}
