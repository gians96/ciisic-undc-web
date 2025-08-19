// ============================================================================
// STORE DE LAYOUT - PRINCIPIO DE RESPONSABILIDAD ÚNICA (SRP)
// ============================================================================

import { defineStore } from 'pinia'
import type { ILayoutState, INotification } from '~/types'

export const useLayoutStore = defineStore('layout', () => {
  // ============================================================================
  // ESTADO
  // ============================================================================

  const state = ref<ILayoutState>({
    isMobileMenuOpen: false,
    isSearchOpen: false,
    isLoading: false,
    notifications: []
  })

  // ============================================================================
  // GETTERS
  // ============================================================================

  const isMobileMenuOpen = computed(() => state.value.isMobileMenuOpen)
  const isSearchOpen = computed(() => state.value.isSearchOpen)
  const isLoading = computed(() => state.value.isLoading)
  const notifications = computed(() => state.value.notifications)
  const unreadNotifications = computed(() => 
    state.value.notifications.filter(notification => !notification.read)
  )
  const notificationCount = computed(() => unreadNotifications.value.length)

  // ============================================================================
  // ACTIONS - MENÚ MÓVIL
  // ============================================================================

  const openMobileMenu = (): void => {
    state.value.isMobileMenuOpen = true
    // Prevenir scroll del body cuando el menú está abierto
    document.body.style.overflow = 'hidden'
  }

  const closeMobileMenu = (): void => {
    state.value.isMobileMenuOpen = false
    // Restaurar scroll del body
    document.body.style.overflow = ''
  }

  const toggleMobileMenu = (): void => {
    if (state.value.isMobileMenuOpen) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  }

  // ============================================================================
  // ACTIONS - BÚSQUEDA
  // ============================================================================

  const openSearch = (): void => {
    state.value.isSearchOpen = true
    // Cerrar menú móvil si está abierto
    if (state.value.isMobileMenuOpen) {
      closeMobileMenu()
    }
  }

  const closeSearch = (): void => {
    state.value.isSearchOpen = false
  }

  const toggleSearch = (): void => {
    if (state.value.isSearchOpen) {
      closeSearch()
    } else {
      openSearch()
    }
  }

  // ============================================================================
  // ACTIONS - LOADING
  // ============================================================================

  const startLoading = (): void => {
    state.value.isLoading = true
  }

  const stopLoading = (): void => {
    state.value.isLoading = false
  }

  const setLoading = (loading: boolean): void => {
    state.value.isLoading = loading
  }

  // ============================================================================
  // ACTIONS - NOTIFICACIONES
  // ============================================================================

  const addNotification = (notification: Omit<INotification, 'id' | 'timestamp' | 'read'>): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification: INotification = {
      id,
      timestamp: new Date(),
      read: false,
      duration: 5000, // 5 segundos por defecto
      ...notification
    }

    state.value.notifications.unshift(newNotification)

    // Auto-remover después de la duración especificada
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string): void => {
    const index = state.value.notifications.findIndex(n => n.id === id)
    if (index > -1) {
      state.value.notifications.splice(index, 1)
    }
  }

  const markNotificationAsRead = (id: string): void => {
    const notification = state.value.notifications.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllNotificationsAsRead = (): void => {
    state.value.notifications.forEach(notification => {
      notification.read = true
    })
  }

  const clearAllNotifications = (): void => {
    state.value.notifications = []
  }

  const clearReadNotifications = (): void => {
    state.value.notifications = state.value.notifications.filter(n => !n.read)
  }

  // ============================================================================
  // METHODS DE CONVENIENCIA PARA NOTIFICACIONES
  // ============================================================================

  const showSuccess = (message: string, title: string = 'Éxito'): string => {
    return addNotification({
      type: 'success',
      title,
      message
    })
  }

  const showError = (message: string, title: string = 'Error'): string => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 8000 // Errores duran más tiempo
    })
  }

  const showWarning = (message: string, title: string = 'Advertencia'): string => {
    return addNotification({
      type: 'warning',
      title,
      message,
      duration: 6000
    })
  }

  const showInfo = (message: string, title: string = 'Información'): string => {
    return addNotification({
      type: 'info',
      title,
      message
    })
  }

  // ============================================================================
  // ACTIONS - UTILIDADES
  // ============================================================================

  const closeAllModals = (): void => {
    closeMobileMenu()
    closeSearch()
  }

  const resetLayout = (): void => {
    state.value = {
      isMobileMenuOpen: false,
      isSearchOpen: false,
      isLoading: false,
      notifications: []
    }
  }

  // ============================================================================
  // WATCHERS - RESPONSIVIDAD
  // ============================================================================

  // Cerrar menús automáticamente en pantallas grandes
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches && state.value.isMobileMenuOpen) {
        closeMobileMenu()
      }
    }
    
    mediaQuery.addEventListener('change', handleMediaChange)

    // Limpiar el listener al desmontar
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', handleMediaChange)
    })
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Estado
    isMobileMenuOpen,
    isSearchOpen,
    isLoading,
    notifications,
    unreadNotifications,
    notificationCount,

    // Actions - Menú móvil
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,

    // Actions - Búsqueda
    openSearch,
    closeSearch,
    toggleSearch,

    // Actions - Loading
    startLoading,
    stopLoading,
    setLoading,

    // Actions - Notificaciones
    addNotification,
    removeNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
    clearReadNotifications,

    // Methods de conveniencia
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Utilidades
    closeAllModals,
    resetLayout
  }
})
