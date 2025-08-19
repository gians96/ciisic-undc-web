// ============================================================================
// COMPOSABLE PARA NAVEGACIÓN - PRINCIPIO DE RESPONSABILIDAD ÚNICA
// ============================================================================

import type { INavigationItem } from '~/types'

export const useNavigation = () => {
  // Estado reactivo para la navegación
  const isMenuOpen = ref(false)
  const currentRoute = ref('')

  // Elementos de navegación principales
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
      icon: 'heroicons:trophy'
    },
    {
      id: 'teams',
      label: 'Equipos',
      href: '/teams',
      icon: 'heroicons:user-group'
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
      icon: 'heroicons:shopping-bag'
    },
    {
      id: 'contact',
      label: 'Contacto',
      href: '/contact',
      icon: 'heroicons:envelope'
    }
  ])

  // Elementos de navegación del footer
  const footerNavigation = ref({
    company: [
      { label: 'Nosotros', href: '/about' },
      { label: 'Carreras', href: '/careers' },
      { label: 'Prensa', href: '/press' },
      { label: 'Términos', href: '/terms' },
      { label: 'Privacidad', href: '/privacy' }
    ],
    support: [
      { label: 'Centro de Ayuda', href: '/help' },
      { label: 'Soporte Técnico', href: '/support' },
      { label: 'Estado del Sistema', href: '/status' },
      { label: 'Reportar Bug', href: '/report-bug' }
    ],
    community: [
      { label: 'Discord', href: 'https://discord.gg/mykd', isExternal: true },
      { label: 'Twitter', href: 'https://twitter.com/mykd', isExternal: true },
      { label: 'YouTube', href: 'https://youtube.com/mykd', isExternal: true },
      { label: 'Twitch', href: 'https://twitch.tv/mykd', isExternal: true }
    ]
  })

  // Métodos para manejar la navegación
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }

  const closeMenu = () => {
    isMenuOpen.value = false
  }

  const openMenu = () => {
    isMenuOpen.value = true
  }

  const setCurrentRoute = (route: string) => {
    currentRoute.value = route
  }

  const isActiveRoute = (href: string): boolean => {
    return currentRoute.value === href
  }

  const getActiveNavItem = (): INavigationItem | undefined => {
    return mainNavigation.value.find(item => item.href === currentRoute.value)
  }

  // Breadcrumbs dinámicos
  const generateBreadcrumbs = (route: string): INavigationItem[] => {
    const parts = route.split('/').filter(Boolean)
    const breadcrumbs: INavigationItem[] = [
      { id: 'home', label: 'Inicio', href: '/' }
    ]

    let currentPath = ''
    parts.forEach((part, index) => {
      currentPath += `/${part}`
      const navItem = mainNavigation.value.find(item => item.href === currentPath)
      
      breadcrumbs.push({
        id: `breadcrumb-${index}`,
        label: navItem?.label || part.charAt(0).toUpperCase() + part.slice(1),
        href: currentPath
      })
    })

    return breadcrumbs
  }

  // Navegación programática
  const goTo = async (href: string, external: boolean = false) => {
    if (external) {
      window.open(href, '_blank')
      return
    }

    await navigateTo(href)
    closeMenu()
    setCurrentRoute(href)
  }

  // Efecto para actualizar la ruta actual
  const route = useRoute()
  watch(() => route.path, (newPath) => {
    setCurrentRoute(newPath)
  }, { immediate: true })

  return {
    // Estado
    isMenuOpen: readonly(isMenuOpen),
    currentRoute: readonly(currentRoute),
    mainNavigation: readonly(mainNavigation),
    footerNavigation: readonly(footerNavigation),
    
    // Métodos
    toggleMenu,
    closeMenu,
    openMenu,
    setCurrentRoute,
    isActiveRoute,
    getActiveNavItem,
    generateBreadcrumbs,
    goTo
  }
}
