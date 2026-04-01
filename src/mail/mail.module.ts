import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { FollowModule } from '../follow/follow.module';

@Module({
    imports: [FollowModule],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
