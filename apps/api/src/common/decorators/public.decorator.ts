import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route (or an entire controller) as reachable without
 * authentication. Every other route is protected by default — see
 * SessionAuthGuard, which is registered as a global guard in AppModule.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
