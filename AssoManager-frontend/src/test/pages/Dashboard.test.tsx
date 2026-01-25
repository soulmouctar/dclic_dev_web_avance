import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { DashboardAdmin } from '@/app/pages/admin/dashboard'
import { memberService } from '@/app/services/memberService'

// Mock du service
vi.mock('@/app/services/memberService', () => ({
  memberService: {
    getAdminStats: vi.fn(),
  },
}))

const mockMemberService = vi.mocked(memberService)

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('DashboardAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render dashboard with loading state', () => {
    mockMemberService.getAdminStats.mockImplementation(() => 
      new Promise(() => {}) // Promise qui ne se résout jamais pour simuler le loading
    )

    renderWithRouter(<DashboardAdmin />)
    
    expect(screen.getByText('Chargement des statistiques...')).toBeInTheDocument()
  })

  it('should render dashboard with stats data', async () => {
    const mockStats = {
      total_members: 25,
      active_members: 20,
      inactive_members: 5,
      new_members_this_month: 3,
      total_revenue: 12500,
      total_contributions: 150,
      paid_this_month: 18,
      unpaid_this_month: 7,
      total_amount_this_month: 1800,
      current_month: 1,
      current_year: 2024,
      recent_activities: [
        {
          type: 'payment' as const,
          title: 'Nouveau paiement',
          description: 'Jean Dupont a payé sa cotisation',
          created_at: '2024-01-15T10:30:00Z'
        }
      ]
    }

    mockMemberService.getAdminStats.mockResolvedValue(mockStats)

    renderWithRouter(<DashboardAdmin />)
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard Administrateur')).toBeInTheDocument()
      expect(screen.getByText('25')).toBeInTheDocument() // Total membres
      expect(screen.getByText('20')).toBeInTheDocument() // Membres actifs
      expect(screen.getByText('5')).toBeInTheDocument() // Membres inactifs
      expect(screen.getByText('12 500 €')).toBeInTheDocument() // Total revenus
    })
  })

  it('should render error state when API fails', async () => {
    mockMemberService.getAdminStats.mockRejectedValue(new Error('API Error'))

    renderWithRouter(<DashboardAdmin />)
    
    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des données/)).toBeInTheDocument()
    })
  })

  it('should render navigation buttons', async () => {
    const mockStats = {
      total_members: 25,
      active_members: 20,
      inactive_members: 5,
      new_members_this_month: 3,
      total_revenue: 12500,
      total_contributions: 150,
      paid_this_month: 18,
      unpaid_this_month: 7,
      total_amount_this_month: 1800,
      current_month: 1,
      current_year: 2024,
      recent_activities: []
    }

    mockMemberService.getAdminStats.mockResolvedValue(mockStats)

    renderWithRouter(<DashboardAdmin />)
    
    await waitFor(() => {
      expect(screen.getByText('Nouveau membre')).toBeInTheDocument()
      expect(screen.getByText('Nouvelle cotisation')).toBeInTheDocument()
    })
  })

  it('should display recent activities when available', async () => {
    const mockStats = {
      total_members: 25,
      active_members: 20,
      inactive_members: 5,
      new_members_this_month: 3,
      total_revenue: 12500,
      total_contributions: 150,
      paid_this_month: 18,
      unpaid_this_month: 7,
      total_amount_this_month: 1800,
      current_month: 1,
      current_year: 2024,
      recent_activities: [
        {
          type: 'payment' as const,
          title: 'Nouveau paiement',
          description: 'Jean Dupont a payé sa cotisation',
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          type: 'member' as const,
          title: 'Nouveau membre',
          description: 'Marie Martin a rejoint l\'association',
          created_at: '2024-01-14T14:20:00Z'
        }
      ]
    }

    mockMemberService.getAdminStats.mockResolvedValue(mockStats)

    renderWithRouter(<DashboardAdmin />)
    
    await waitFor(() => {
      expect(screen.getByText('Activités récentes')).toBeInTheDocument()
      expect(screen.getByText('Nouveau paiement')).toBeInTheDocument()
      expect(screen.getByText('Jean Dupont a payé sa cotisation')).toBeInTheDocument()
      expect(screen.getByText('Nouveau membre')).toBeInTheDocument()
      expect(screen.getByText('Marie Martin a rejoint l\'association')).toBeInTheDocument()
    })
  })
})
