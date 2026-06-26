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

export interface Repository {
  id: number,
  name: string,
  private: boolean,
  owner: User,
  html_url: string,
  description: string | null,
  created_at: string,
  updated_at: string,
  size: number,
  stargazers_count: number,
  watchers_count: number,
  language: string | null,
  forks_count: number
}