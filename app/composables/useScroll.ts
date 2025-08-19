// ============================================================================
// COMPOSABLE PARA MANEJO DE SCROLL - PRINCIPIO DE RESPONSABILIDAD ÚNICA
// ============================================================================

export const useScroll = () => {
  // Estado reactivo del scroll
  const scrollY = ref(0)
  const isScrolling = ref(false)
  const isScrolledDown = ref(false)
  const lastScrollPosition = ref(0)

  // Configuración de scroll suave
  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      behavior
    })
  }

  const scrollToElement = (
    elementId: string, 
    offset: number = 0, 
    behavior: ScrollBehavior = 'smooth'
  ) => {
    const element = document.getElementById(elementId)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior
      })
    }
  }

  const scrollToPosition = (
    position: number, 
    behavior: ScrollBehavior = 'smooth'
  ) => {
    window.scrollTo({
      top: position,
      behavior
    })
  }

  // Detección de dirección de scroll
  const updateScrollDirection = () => {
    const currentScrollY = window.scrollY
    
    if (currentScrollY > lastScrollPosition.value) {
      isScrolledDown.value = true
    } else {
      isScrolledDown.value = false
    }
    
    lastScrollPosition.value = currentScrollY
  }

  // Handler del evento scroll con throttling
  let scrollTimeout: NodeJS.Timeout | null = null
  
  const handleScroll = () => {
    scrollY.value = window.scrollY
    isScrolling.value = true
    updateScrollDirection()

    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }

    scrollTimeout = setTimeout(() => {
      isScrolling.value = false
    }, 150)
  }

  // Detectar si un elemento está visible en el viewport
  const isElementInView = (elementId: string, threshold: number = 0): boolean => {
    const element = document.getElementById(elementId)
    if (!element) return false

    const rect = element.getBoundingClientRect()
    const windowHeight = window.innerHeight || document.documentElement.clientHeight

    return (
      rect.top >= -rect.height * threshold &&
      rect.bottom <= windowHeight + rect.height * threshold
    )
  }

  // Obtener el porcentaje de scroll de la página
  const getScrollPercentage = (): number => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    return scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  }

  // Verificar si el usuario ha llegado al final de la página
  const isAtBottom = (): boolean => {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  }

  // Deshabilitar/habilitar scroll en el body
  const disableScroll = () => {
    document.body.style.overflow = 'hidden'
  }

  const enableScroll = () => {
    document.body.style.overflow = ''
  }

  // Hook para el ciclo de vida del componente
  onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Inicializar con la posición actual
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
    }
  })

  return {
    // Estado reactivo
    scrollY: readonly(scrollY),
    isScrolling: readonly(isScrolling),
    isScrolledDown: readonly(isScrolledDown),
    
    // Métodos de navegación
    scrollToTop,
    scrollToElement,
    scrollToPosition,
    
    // Métodos de utilidad
    isElementInView,
    getScrollPercentage,
    isAtBottom,
    disableScroll,
    enableScroll
  }
}
