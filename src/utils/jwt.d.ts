import { Role } from "@prisma/client";
export interface AccessTokenPayload {
    id: string;
    role: Role;
}
export declare function signAccessToken(payload: AccessTokenPayload): string;
export declare function signRefreshToken(payload: {
    id: string;
}): string;
export declare function verifyAccessToken(token: string): AccessTokenPayload;
export declare function verifyRefreshToken(token: string): {
    id: string;
};
//# sourceMappingURL=jwt.d.ts.map