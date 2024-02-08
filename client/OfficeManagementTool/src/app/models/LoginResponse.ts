import { UserInfo } from "./UserInfo";

export interface LoginResponse {
    token: string,
    user: UserInfo
}