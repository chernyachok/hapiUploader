import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
}

interface DecodedToken extends TokenPayload {}

export const generateToken = (payload: TokenPayload, jwtSecret: string, jwtExp: string) =>
    jwt.sign(payload, jwtSecret, { expiresIn: jwtExp, algorithm: 'HS256' });

export const decodeToken = (token: string, jwtSecret: string): DecodedToken =>
    jwt.verify(token, jwtSecret, { algorithms: ['HS256']}) as DecodedToken;