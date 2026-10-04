declare const registerUser: (name: string, email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const loginUser: (email: string, password: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const refreshAccessToken: (refreshToken: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
declare const logoutUser: (refreshToken: string) => Promise<void>;
export declare const AuthService: {
    registerUser: typeof registerUser;
    loginUser: typeof loginUser;
    logoutUser: typeof logoutUser;
    refreshAccessToken: typeof refreshAccessToken;
};
export {};
//# sourceMappingURL=auth.service.d.ts.map