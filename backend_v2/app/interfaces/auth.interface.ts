export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	tokenType: "Bearer";
	refreshTokenExpiresIn: number | null;
	accessTokenExpiresIn: number;
}

export interface TokenPayload {
	sub: string;
	email: string;
}
