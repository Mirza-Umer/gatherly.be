import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EventBusService {
    constructor(private readonly eventEmitter: EventEmitter2) { }

    emit(event: string, payload: any) {
        this.eventEmitter.emit(event, payload);
    }
}
