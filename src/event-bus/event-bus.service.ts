import { Injectable,  } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { SavedPost } from '../post/entities/savedPost.entity';
import { Post } from '../post/entities/post.entity';
import { Repository } from 'typeorm';
import { Like } from '../likes/entities/like.entity';

@Injectable()
export class EventBusService {
    constructor(private readonly eventEmitter: EventEmitter2) { }

    emit(event: string, payload: any) {
        this.eventEmitter.emit(event, payload);
    }
}
