// ============================================================================
// INTERFACES - PRINCIPIO DE SEGREGACIÓN DE INTERFACES (ISP)
// ============================================================================

// Interfaz base para entidades
export interface IEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Interfaz para navegación
export interface INavigationItem {
  id: string
  label: string
  href: string
  icon?: string
  children?: INavigationItem[]
  isActive?: boolean
  isExternal?: boolean
}

// Interfaz para meta información de páginas
export interface IPageMeta {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
}

// Interfaz para configuración de SEO
export interface ISEOConfig extends IPageMeta {
  siteName: string
  locale: string
  type: 'website' | 'article' | 'product'
}

// Interfaz para usuario
export interface IUser extends IEntity {
  username: string
  email: string
  avatar?: string
  role: UserRole
  isActive: boolean
}

// Interfaz para equipo/team
export interface ITeam extends IEntity {
  name: string
  description: string
  logo: string
  members: ITeamMember[]
  achievements: IAchievement[]
  socialLinks: ISocialLink[]
}

// Interfaz para miembro de equipo
export interface ITeamMember extends IEntity {
  name: string
  nickname: string
  position: string
  avatar: string
  bio?: string
  stats: IPlayerStats
  socialLinks: ISocialLink[]
}

// Interfaz para estadísticas de jugador
export interface IPlayerStats {
  kills: number
  deaths: number
  assists: number
  wins: number
  losses: number
  kdr: number
  winRate: number
}

// Interfaz para logros
export interface IAchievement extends IEntity {
  title: string
  description: string
  icon: string
  date: Date
  category: AchievementCategory
}

// Interfaz para enlaces sociales
export interface ISocialLink {
  platform: SocialPlatform
  url: string
  handle: string
}

// Interfaz para torneo
export interface ITournament extends IEntity {
  name: string
  description: string
  banner: string
  startDate: Date
  endDate: Date
  prizePool: number
  currency: string
  status: TournamentStatus
  teams: ITeam[]
  brackets: IBracket[]
  rules: string[]
}

// Interfaz para bracket de torneo
export interface IBracket extends IEntity {
  tournamentId: string
  round: number
  matches: IMatch[]
  type: BracketType
}

// Interfaz para partido/match
export interface IMatch extends IEntity {
  team1: ITeam
  team2: ITeam
  score1: number
  score2: number
  status: MatchStatus
  scheduledAt: Date
  playedAt?: Date
  winner?: ITeam
  streamUrl?: string
}

// Interfaz para producto de la tienda
export interface IProduct extends IEntity {
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  category: ProductCategory
  tags: string[]
  inStock: boolean
  stockQuantity: number
  rating: number
  reviews: IReview[]
}

// Interfaz para reseña
export interface IReview extends IEntity {
  productId: string
  userId: string
  rating: number
  comment: string
  helpful: number
  isVerified: boolean
}

// Interfaz para artículo de blog
export interface IBlogPost extends IEntity {
  title: string
  slug: string
  excerpt: string
  content: string
  author: IUser
  featuredImage: string
  categories: string[]
  tags: string[]
  publishedAt: Date
  isPublished: boolean
  readTime: number
  views: number
  likes: number
}

// Interfaz para comentario
export interface IComment extends IEntity {
  postId: string
  userId: string
  content: string
  parentId?: string
  replies?: IComment[]
  likes: number
  isApproved: boolean
}

// Interfaz para streaming
export interface IStream extends IEntity {
  title: string
  description: string
  thumbnail: string
  streamer: IUser
  viewerCount: number
  isLive: boolean
  startedAt: Date
  endedAt?: Date
  category: StreamCategory
  tags: string[]
}

// ============================================================================
// ENUMS Y TIPOS
// ============================================================================

export type UserRole = 'admin' | 'moderator' | 'player' | 'viewer'

export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled'

export type MatchStatus = 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled'

export type BracketType = 'single_elimination' | 'double_elimination' | 'round_robin'

export type AchievementCategory = 'tournament' | 'personal' | 'team' | 'special'

export type SocialPlatform = 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'twitch' | 'discord'

export type ProductCategory = 'merchandise' | 'peripherals' | 'games' | 'digital'

export type StreamCategory = 'tournament' | 'practice' | 'casual' | 'tutorial'

// ============================================================================
// TIPOS DE RESPUESTA DE API
// ============================================================================

export interface IAPIResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

export interface IPaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

// ============================================================================
// TIPOS DE CONFIGURACIÓN
// ============================================================================

export interface IAppConfig {
  name: string
  version: string
  description: string
  url: string
  api: {
    baseUrl: string
    timeout: number
  }
  features: {
    tournaments: boolean
    shop: boolean
    blog: boolean
    streaming: boolean
    teams: boolean
  }
}

// ============================================================================
// TIPOS DE ESTADO GLOBAL (PINIA)
// ============================================================================

export interface ILayoutState {
  isMobileMenuOpen: boolean
  isSearchOpen: boolean
  isLoading: boolean
  notifications: INotification[]
}

export interface IUserState {
  currentUser: IUser | null
  isAuthenticated: boolean
  permissions: string[]
}

export interface INotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: Date
  read: boolean
  action?: {
    label: string
    handler: () => void
  }
}

// Interfaz para resultados de búsqueda
export interface ISearchResult {
  id: string
  type: string
  title: string
  description: string
  href: string
  icon: string
  badge?: string
}

// ============================================================================
// TIPOS DE FORMULARIOS
// ============================================================================

export interface ILoginForm {
  email: string
  password: string
  remember: boolean
}

export interface IRegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

export interface IContactForm {
  name: string
  email: string
  subject: string
  message: string
}

// ============================================================================
// TIPOS DE EVENTOS
// ============================================================================

export interface IEvent {
  type: string
  payload?: any
  timestamp: Date
}

export interface ISocketEvent extends IEvent {
  room?: string
  userId?: string
}

// ============================================================================
// TIPOS PARA PONENTES
// ============================================================================

export interface Ponente {
  id: number
  nombre: string
  imagen: string
  descripcion?: string
  linkedin?: string
  empresa?: string
  especialidades: string[]
}

// ============================================================================
// INTERFACES PARA CONSULTA DE DNI
// ============================================================================

export interface DniData {
  documentNumber: string
  documentType: string
  names: string
  paternalSurname: string
  maternalSurname: string
  fullName: string
}

export interface DniMetadata {
  provider: string
  isCached: boolean
  responseTime: number
  dataSource: string
  requestOrigin: string
  billableToClient: boolean
  consumesSubscription: boolean
  remaining_credits: number
}

export interface DniConsultationResponse {
  success: boolean
  data: DniData
  metadata: DniMetadata
}

export interface DocumentType {
  value: 'DNI' | 'CE'
  label: string
  maxLength: number
  placeholder: string
  pattern: string
}
