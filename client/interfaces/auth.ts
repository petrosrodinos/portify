import { Subscription } from "./billing";
import { PlanType } from "@/constants/plans";
import { UserPreferences } from "./user";

export interface SignInUser {
    email: string;
    password: string;
}

export interface SignUpUser {
    email: string;
    password: string;
}

export interface AuthUser {
    user_id: string;
    email: string;
    access_token: string;
    expires_at: number;
    avatar?: string;
    full_name?: string;
    isNewUser?: boolean;
    isLoggedIn?: boolean;
    preferences?: UserPreferences;
    subscription?: Subscription;
    plan?: PlanType;
}