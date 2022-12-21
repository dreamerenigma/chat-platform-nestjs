import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
	protected getTracker(req: Record<string, any>): string {
		console.log('Inside ThrottlerBehindProxyGuard');
		console.log(req.ips);
		return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
	}
}
