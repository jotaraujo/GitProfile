export interface User {
  login: string,
  name: string | null,
  avatar_url: string,
  bio: string | null,
  location: string | null,
  followers: number,
  following: number,
  public_gists: number,
  company: string | null,
  created_at: string
}