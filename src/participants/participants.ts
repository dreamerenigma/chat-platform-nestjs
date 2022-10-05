import { Participant } from "src/utils/typeorm";
import { CreateParticipantParams, FindParticipantParams } from "src/utils/types";

export interface IParticipantsService {
	findParticipant(params: FindParticipantParams): Promise<Participant | null>;
	createParticipant(params: CreateParticipantParams): Promise<Participant>;
} 