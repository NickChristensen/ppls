export type SocialAccount = {
  id: number
  name: string
  provider: string
}

export type Profile = {
  auth_token: string
  email?: string
  first_name?: string
  has_usable_password: boolean
  is_mfa_enabled: boolean
  last_name?: string
  password?: string
  social_accounts: SocialAccount[]
}
