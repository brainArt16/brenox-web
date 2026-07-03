import { engineFetch } from "./client"
import { clearToken, setToken } from "./session"
import type { UserProfile } from "@/lib/types"

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  email: string
  username: string
  password: string
}

export interface AuthUser {
  id: number
  email: string
  username: string
}

export async function loginRequest(input: LoginInput): Promise<string> {
  const data = await engineFetch<{ token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    auth: false,
    refreshOnUnauthorized: false,
  })
  return data.token
}

export async function registerRequest(input: RegisterInput): Promise<AuthUser> {
  return engineFetch<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
    auth: false,
    refreshOnUnauthorized: false,
  })
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  return engineFetch<UserProfile>("/api/users/me")
}

export async function login(input: LoginInput, remember = true): Promise<UserProfile> {
  const token = await loginRequest(input)
  setToken(token, remember)
  return fetchCurrentUser()
}

export async function register(input: RegisterInput, remember = true): Promise<UserProfile> {
  await registerRequest(input)
  return login({ email: input.email, password: input.password }, remember)
}

export function logout(): void {
  clearToken()
}
