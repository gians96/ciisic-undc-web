// Tipos mínimos de Google Identity Services (https://accounts.google.com/gsi/client).
// Copiados de app-web-sigenet (types/google-identity-services.d.ts) y ampliados con `ux_mode` y
// `cancel()`. `prompt()` (One Tap) no se declara a propósito: la landing solo usa el botón.

interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

interface GoogleIdConfiguration {
  client_id: string
  callback: (response: GoogleCredentialResponse) => void
  auto_select?: boolean
  ux_mode?: 'popup' | 'redirect'
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface GoogleAccountsId {
  initialize(config: GoogleIdConfiguration): void
  renderButton(parent: HTMLElement, options: GoogleButtonConfiguration): void
  disableAutoSelect(): void
  cancel(): void
}

interface Window {
  google?: {
    accounts: {
      id: GoogleAccountsId
    }
  }
}
