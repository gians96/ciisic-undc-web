// ============================================================================
// STORE DE NAVEGACIÓN - PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)
// ============================================================================

import { defineStore } from 'pinia'
import type { INavigationItem } from '~/types'

export const useNavigationStore = defineStore('navigation', () => {
  // ============================================================================
  // ESTADO
  // ============================================================================

  const currentRoute = ref('')
  const previousRoute = ref('')
  const breadcrumbs = ref<INavigationItem[]>([])
  const navigationHistory = ref<string[]>([])

  // Items de navegación principales
  const mainNavigation = ref<INavigationItem[]>([
    {
      id: 'home',
      label: 'Inicio',
      href: '/',
      icon: 'heroicons:home'
    },
    {
      id: 'about',
      label: 'Nosotros',
      href: '/about',
      icon: 'heroicons:information-circle'
    },
    {
      id: 'tournaments',
      label: 'Torneos',
      href: '/tournaments',
      icon: 'heroicons:trophy',
      children: [
        {
          id: 'tournaments-active',
          label: 'Torneos Activos',
          href: '/tournaments/active'
        },
        {
          id: 'tournaments-upcoming',
          label: 'Próximos Torneos',
          href: '/tournaments/upcoming'
        },
        {
          id: 'tournaments-results',
          label: 'Resultados',
          href: '/tournaments/results'
        }
      ]
    },
    {
      id: 'teams',
      label: 'Equipos',
      href: '/teams',
      icon: 'heroicons:user-group',
      children: [
        {
          id: 'teams-all',
          label: 'Todos los Equipos',
          href: '/teams'
        },
        {
          id: 'teams-rankings',
          label: 'Rankings',
          href: '/teams/rankings'
        },
        {
          id: 'teams-join',
          label: 'Únete a un Equipo',
          href: '/teams/join'
        }
      ]
    },
    {
      id: 'matches',
      label: 'Partidas',
      href: '/matches',
      icon: 'heroicons:play',
      children: [
        {
          id: 'matches-live',
          label: 'En Vivo',
          href: '/matches/live'
        },
        {
          id: 'matches-upcoming',
          label: 'Próximas',
          href: '/matches/upcoming'
        },
        {
          id: 'matches-results',
          label: 'Resultados',
          href: '/matches/results'
        }
      ]
    },
    {
      id: 'blog',
      label: 'Blog',
      href: '/blog',
      icon: 'heroicons:newspaper'
    },
    {
      id: 'shop',
      label: 'Tienda',
      href: '/shop',
      icon: 'heroicons:shopping-bag',
      children: [
        {
          id: 'shop-merchandise',
          label: 'Merchandising',
          href: '/shop/merchandise'
        },
        {
          id: 'shop-peripherals',
          label: 'Periféricos',
          href: '/shop/peripherals'
        },
        {
          id: 'shop-games',
          label: 'Juegos',
          href: '/shop/games'
        }
      ]
    },
    {
      id: 'contact',
      label: 'Contacto',
      href: '/contact',
      icon: 'heroicons:envelope'
    }
  ])

  // Links del footer organizados por categorías
  const footerNavigation = ref({
    company: {
      title: 'Empresa',
      links: [
        { label: 'Nosotros', href: '/about', isExternal: false },
        { label: 'Nuestro Equipo', href: '/team', isExternal: false },
        { label: 'Carreras', href: '/careers', isExternal: false },
        { label: 'Prensa', href: '/press', isExternal: false },
        { label: 'Patrocinadores', href: '/sponsors', isExternal: false }
      ]
    },
    tournaments: {
      title: 'Torneos',
      links: [
        { label: 'Torneos Activos', href: '/tournaments/active', isExternal: false },
        { label: 'Próximos Torneos', href: '/tournaments/upcoming', isExternal: false },
        { label: 'Resultados', href: '/tournaments/results', isExternal: false },
        { label: 'Rankings', href: '/rankings', isExternal: false },
        { label: 'Reglas', href: '/rules', isExternal: false }
      ]
    },
    community: {
      title: 'Comunidad',
      links: [
        { label: 'Discord', href: 'https://discord.gg/mykd', isExternal: true },
        { label: 'Twitter', href: 'https://twitter.com/mykd', isExternal: true },
        { label: 'YouTube', href: 'https://youtube.com/mykd', isExternal: true },
        { label: 'Twitch', href: 'https://twitch.tv/mykd', isExternal: true },
        { label: 'Instagram', href: 'https://instagram.com/mykd', isExternal: true }
      ]
    },
    support: {
      title: 'Soporte',
      links: [
        { label: 'Centro de Ayuda', href: '/help', isExternal: false },
        { label: 'Soporte Técnico', href: '/support', isExternal: false },
        { label: 'Estado del Sistema', href: '/status', isExternal: false },
        { label: 'Reportar Bug', href: '/report-bug', isExternal: false },
        { label: 'FAQ', href: '/faq', isExternal: false }
      ]
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Términos de Servicio', href: '/terms', isExternal: false },
        { label: 'Política de Privacidad', href: '/privacy', isExternal: false },
        { label: 'Política de Cookies', href: '/cookies', isExternal: false },
        { label: 'GDPR', href: '/gdpr', isExternal: false }
      ]
    }
  })

  // ============================================================================
  // GETTERS
  // ============================================================================

  const currentActiveItem = computed(() => {
    return findActiveNavigationItem(mainNavigation.value, currentRoute.value)
  })

  const currentBreadcrumbs = computed(() => breadcrumbs.value)

  const canGoBack = computed(() => navigationHistory.value.length > 1)

  // ============================================================================
  // HELPERS
  // ============================================================================

  const findActiveNavigationItem = (
    items: INavigationItem[], 
    route: string
  ): INavigationItem | null => {
    for (const item of items) {
      if (item.href === route) {
        return item
      }
      if (item.children) {
        const childMatch = findActiveNavigationItem(item.children, route)
        if (childMatch) return childMatch
      }
    }
    return null
  }

  const findNavigationItemById = (
    items: INavigationItem[], 
    id: string
  ): INavigationItem | null => {
    for (const item of items) {
      if (item.id === id) {
        return item
      }
      if (item.children) {
        const childMatch = findNavigationItemById(item.children, id)
        if (childMatch) return childMatch
      }
    }
    return null
  }

  // ============================================================================
  // ACTIONS
  // ============================================================================

  const setCurrentRoute = (route: string): void => {
    if (currentRoute.value !== route) {
      previousRoute.value = currentRoute.value
      currentRoute.value = route
      
      // Agregar a historial
      if (!navigationHistory.value.includes(route)) {
        navigationHistory.value.push(route)
      }
      
      // Mantener solo los últimos 10 elementos en el historial
      if (navigationHistory.value.length > 10) {
        navigationHistory.value.shift()
      }
      
      // Generar breadcrumbs
      generateBreadcrumbs(route)
    }
  }

  const generateBreadcrumbs = (route: string): void => {
    const parts = route.split('/').filter(Boolean)
    const newBreadcrumbs: INavigationItem[] = [
      { id: 'home', label: 'Inicio', href: '/' }
    ]

    let currentPath = ''
    parts.forEach((part, index) => {
      currentPath += `/${part}`
      
      // Buscar en la navegación principal
      const navItem = findActiveNavigationItem(mainNavigation.value, currentPath)
      
      newBreadcrumbs.push({
        id: `breadcrumb-${index}`,
        label: navItem?.label || part.charAt(0).toUpperCase() + part.slice(1),
        href: currentPath
      })
    })

    breadcrumbs.value = newBreadcrumbs
  }

  const isActiveRoute = (href: string): boolean => {
    return currentRoute.value === href || currentRoute.value.startsWith(href + '/')
  }

  const isParentRoute = (href: string): boolean => {
    return currentRoute.value.startsWith(href + '/') && href !== '/'
  }

  const goBack = (): string | null => {
    if (canGoBack.value) {
      const currentIndex = navigationHistory.value.indexOf(currentRoute.value)
      if (currentIndex > 0) {
        return navigationHistory.value[currentIndex - 1] || null
      }
    }
    return null
  }

  const clearHistory = (): void => {
    navigationHistory.value = []
  }

  // ============================================================================
  // COMPUTED HELPERS
  // ============================================================================

  const getFlatNavigationItems = computed(() => {
    const flattenItems = (items: INavigationItem[]): INavigationItem[] => {
      const result: INavigationItem[] = []
      
      items.forEach(item => {
        result.push(item)
        if (item.children) {
          result.push(...flattenItems(item.children))
        }
      })
      
      return result
    }
    
    return flattenItems(mainNavigation.value)
  })

  const getNavigationItemsByLevel = computed(() => {
    return {
      level1: mainNavigation.value,
      level2: mainNavigation.value.filter(item => item.children).flatMap(item => item.children || [])
    }
  })

  // ============================================================================
  // NAVIGATION METHODS
  // ============================================================================

  const updateNavigationItemLabel = (id: string, newLabel: string): void => {
    const item = findNavigationItemById(mainNavigation.value, id)
    if (item) {
      item.label = newLabel
    }
  }

  const addNavigationItem = (parentId: string | null, newItem: INavigationItem): void => {
    if (!parentId) {
      mainNavigation.value.push(newItem)
    } else {
      const parent = findNavigationItemById(mainNavigation.value, parentId)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(newItem)
      }
    }
  }

  const removeNavigationItem = (id: string): void => {
    const removeFromArray = (items: INavigationItem[]): boolean => {
      const index = items.findIndex(item => item.id === id)
      if (index > -1) {
        items.splice(index, 1)
        return true
      }
      
      return items.some(item => {
        if (item.children) {
          return removeFromArray(item.children)
        }
        return false
      })
    }
    
    removeFromArray(mainNavigation.value)
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    currentRoute: readonly(currentRoute),
    previousRoute: readonly(previousRoute),
    breadcrumbs: readonly(breadcrumbs),
    navigationHistory: readonly(navigationHistory),
    mainNavigation: readonly(mainNavigation),
    footerNavigation: readonly(footerNavigation),

    // Getters computados
    currentActiveItem,
    currentBreadcrumbs,
    canGoBack,
    getFlatNavigationItems,
    getNavigationItemsByLevel,

    // Actions
    setCurrentRoute,
    generateBreadcrumbs,
    isActiveRoute,
    isParentRoute,
    goBack,
    clearHistory,

    // Métodos de navegación
    updateNavigationItemLabel,
    addNavigationItem,
    removeNavigationItem,

    // Helpers
    findActiveNavigationItem,
    findNavigationItemById
  }
})
