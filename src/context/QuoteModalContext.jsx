/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'

const QuoteModalContext = createContext(null)

/**
 * Provider component that manages the state of the global Quote Modal.
 */
export function QuoteModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')

  const openQuoteModal = useCallback((product = '') => {
    setSelectedProduct(typeof product === 'string' ? product : '')
    setIsOpen(true)
  }, [])

  const closeQuoteModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  return (
    <QuoteModalContext.Provider
      value={{
        isOpen,
        selectedProduct,
        openQuoteModal,
        closeQuoteModal,
      }}
    >
      {children}
    </QuoteModalContext.Provider>
  )
}

/**
 * Hook to access the quote modal context.
 *
 * @returns {{
 *   isOpen: boolean,
 *   selectedProduct: string,
 *   openQuoteModal: (product?: string) => void,
 *   closeQuoteModal: () => void
 * }}
 */
export function useQuoteModal() {
  const context = useContext(QuoteModalContext)
  if (!context) {
    throw new Error('useQuoteModal must be used within a QuoteModalProvider')
  }
  return context
}
