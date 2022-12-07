import { Test, TestingModule } from '@nestjs/testing';
import { mockUser } from '../../__mocks__';
import { Services } from '../../utils/constants';
import { FriendRequestController } from "../friend-requests.controller";
import { IFriendRequestService } from '../friend-requests';

describe('FriendRequestController', () => {
	let controller: FriendRequestController;
	let friendRequestService: IFriendRequestService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [FriendRequestController],
			providers: [
				{
					provide: Services.FRIENDS_REQUESTS_SERVICE,
					useValue: {
						getFriendRequests: jest.fn((x) => x),
						create: jest.fn((x) => x),
					},
				},
			],
		}).compile();

		controller = module.get<FriendRequestController>(FriendRequestController);
		friendRequestService = module.get<IFriendRequestService>(
			Services.FRIENDS_REQUESTS_SERVICE,
		);
		jest.clearAllMocks();
	});

	it('controller should be defined', () => {
		expect(controller).toBeDefined();
		expect(friendRequestService).toBeDefined();
	});

	it('should call friendRequestService.getFriendRequests', async () => {
		await controller.getFriendRequests(mockUser);
		expect(friendRequestService.getFriendRequests).
		toHaveBeenCalled();
		expect(friendRequestService.getFriendRequests).
		toHaveBeenCalledWith(
			mockUser.id,
		);
	});

	it('should call createFriendRequest with correct params', async () => {
		await controller.createFriendRequest(mockUser, {
			email: 'verclocker1@gmail.com'
		});
		expect(friendRequestService.create).toHaveBeenCalledWith({
			user: mockUser,
			email: 'verclocker1@gmail.com',
		});
	});
});
