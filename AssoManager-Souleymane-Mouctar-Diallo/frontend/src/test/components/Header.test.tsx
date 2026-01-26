import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '@/app/components/header'

// Mock du localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

// Mock de react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the logo and title', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByText('AssoManager')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('should show login button when user is not authenticated', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    renderWithRouter(<Header />)
    
    expect(screen.getByText('Se connecter')).toBeInTheDocument()
  })

  it('should show user menu when user is authenticated', () => {
    const mockUser = JSON.stringify({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    })
    mockLocalStorage.getItem.mockReturnValue(mockUser)
    
    renderWithRouter(<Header />)
    
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Se déconnecter')).toBeInTheDocument()
  })

  it('should handle logout correctly', () => {
    const mockUser = JSON.stringify({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN'
    })
    mockLocalStorage.getItem.mockReturnValue(mockUser)
    
    renderWithRouter(<Header />)
    
    const logoutButton = screen.getByText('Se déconnecter')
    fireEvent.click(logoutButton)
    
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('user')
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token')
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('should toggle mobile menu', () => {
    renderWithRouter(<Header />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)
    
    // Vérifier que le menu mobile s'ouvre
    expect(screen.getByRole('navigation')).toHaveClass('translate-x-0')
  })
})
