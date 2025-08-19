// ============================================================================
// COMPOSABLE PARA INTERSECTION OBSERVER - PRINCIPIO DE RESPONSABILIDAD ÚNICA
// ============================================================================

export const useIntersectionObserver = () => {
  const observers = new Map<string, IntersectionObserver>()

  /**
   * Observa cuando un elemento entra en el viewport
   */
  const observe = (
    elementRef: Ref<HTMLElement | null>,
    callback: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
    options: IntersectionObserverInit = {}
  ): string => {
    const observerId = Math.random().toString(36).substr(2, 9)

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry, obs)
        }
      })
    }, defaultOptions)

    watch(elementRef, (newElement, oldElement) => {
      if (oldElement) {
        observer.unobserve(oldElement)
      }
      if (newElement) {
        observer.observe(newElement)
      }
    }, { immediate: true })

    observers.set(observerId, observer)
    return observerId
  }

  /**
   * Observa múltiples elementos
   */
  const observeMultiple = (
    elements: Ref<HTMLElement[]>,
    callback: (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void,
    options: IntersectionObserverInit = {}
  ): string => {
    const observerId = Math.random().toString(36).substr(2, 9)

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      ...options
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => callback(entry, obs))
    }, defaultOptions)

    watch(elements, (newElements, oldElements) => {
      // Desconectar elementos anteriores
      if (oldElements) {
        oldElements.forEach(element => {
          if (element) observer.unobserve(element)
        })
      }
      
      // Observar nuevos elementos
      if (newElements) {
        newElements.forEach(element => {
          if (element) observer.observe(element)
        })
      }
    }, { immediate: true })

    observers.set(observerId, observer)
    return observerId
  }

  /**
   * Observa entrada y salida del viewport
   */
  const observeVisibility = (
    elementRef: Ref<HTMLElement | null>,
    onEnter?: (entry: IntersectionObserverEntry) => void,
    onLeave?: (entry: IntersectionObserverEntry) => void,
    options: IntersectionObserverInit = {}
  ): string => {
    return observe(elementRef, (entry) => {
      if (entry.isIntersecting && onEnter) {
        onEnter(entry)
      } else if (!entry.isIntersecting && onLeave) {
        onLeave(entry)
      }
    }, options)
  }

  /**
   * Observa para animaciones de entrada
   */
  const observeForAnimation = (
    elementRef: Ref<HTMLElement | null>,
    animationClass: string = 'animate-fade-in-up',
    options: IntersectionObserverInit = {}
  ): string => {
    return observe(elementRef, (entry, observer) => {
      entry.target.classList.add(animationClass)
      observer.unobserve(entry.target)
    }, {
      threshold: 0.1,
      ...options
    })
  }

  /**
   * Observa para lazy loading de imágenes
   */
  const observeForLazyLoad = (
    imageRef: Ref<HTMLImageElement | null>,
    options: IntersectionObserverInit = {}
  ): string => {
    return observe(imageRef, (entry, observer) => {
      const img = entry.target as HTMLImageElement
      const dataSrc = img.getAttribute('data-src')
      
      if (dataSrc) {
        img.src = dataSrc
        img.removeAttribute('data-src')
        img.classList.remove('lazy')
        img.classList.add('loaded')
      }
      
      observer.unobserve(img)
    }, {
      rootMargin: '50px',
      ...options
    })
  }

  /**
   * Observa el progreso de scroll de un elemento
   */
  const observeScrollProgress = (
    elementRef: Ref<HTMLElement | null>,
    callback: (progress: number) => void,
    options: IntersectionObserverInit = {}
  ): string => {
    const observerId = Math.random().toString(36).substr(2, 9)

    const defaultOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 a 1 en incrementos de 0.01
      ...options
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect
          const windowHeight = window.innerHeight
          const elementHeight = rect.height
          const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0)
          const progress = Math.max(0, Math.min(1, visibleHeight / elementHeight))
          
          callback(progress)
        }
      })
    }, defaultOptions)

    watch(elementRef, (newElement, oldElement) => {
      if (oldElement) {
        observer.unobserve(oldElement)
      }
      if (newElement) {
        observer.observe(newElement)
      }
    }, { immediate: true })

    observers.set(observerId, observer)
    return observerId
  }

  /**
   * Detiene la observación de un elemento específico
   */
  const unobserve = (observerId: string): void => {
    const observer = observers.get(observerId)
    if (observer) {
      observer.disconnect()
      observers.delete(observerId)
    }
  }

  /**
   * Detiene todas las observaciones
   */
  const disconnectAll = (): void => {
    observers.forEach(observer => observer.disconnect())
    observers.clear()
  }

  // Limpiar observadores al desmontar el componente
  onUnmounted(() => {
    disconnectAll()
  })

  return {
    observe,
    observeMultiple,
    observeVisibility,
    observeForAnimation,
    observeForLazyLoad,
    observeScrollProgress,
    unobserve,
    disconnectAll
  }
}
