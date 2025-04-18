import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import * as url from "node:url";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class PrismaService extends PrismaClient {
    constructor( configService : ConfigService) {
        super({
            datasources: {
                db: {
                    url : configService.get("DATABASE_URL")
                }
            }
        });
    }
}
