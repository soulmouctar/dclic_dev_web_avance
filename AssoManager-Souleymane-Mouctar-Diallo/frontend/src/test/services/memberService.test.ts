import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock du module memberService directement
vi.mock('@/app/services/memberService', () => ({
  memberService: {
    getMembers: vi.fn(),
    getAdminStats: vi.fn(),
    createMember: vi.fn(),
  },
}))

const { memberService } = await import('@/app/services/memberService')
const mockMemberService = vi.mocked(memberService)

describe('MemberService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMembers', () => {
    it('should fetch members successfully', async () => {
      const mockResponse = {
        members: [
          {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            phone: '123456789',
            status: 'ACTIVE' as const,
            role: 'MEMBER' as const,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }
        ],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 1
        }
      }

      mockMemberService.getMembers.mockResolvedValue(mockResponse)

      const result = await memberService.getMembers()
      
      expect(mockMemberService.getMembers).toHaveBeenCalled()
      expect(result).toEqual(mockResponse)
    })

    it('should return empty response when service fails', async () => {
      const emptyResponse = {
        members: [],
        pagination: {
          current_page: 1,
          last_page: 1,
          per_page: 20,
          total: 0
        }
      }

      mockMemberService.getMembers.mockResolvedValue(emptyResponse)

      const result = await memberService.getMembers()
      
      expect(result).toEqual(emptyResponse)
    })
  })

  describe('getAdminStats', () => {
    it('should fetch admin stats successfully', async () => {
      const mockStats = {
        total_members: 10,
        active_members: 8,
        inactive_members: 2,
        new_members_this_month: 3,
        total_revenue: 5000,
        total_contributions: 50,
        paid_this_month: 8,
        unpaid_this_month: 2,
        total_amount_this_month: 800,
        current_month: 1,
        current_year: 2024,
        recent_activities: []
      }

      mockMemberService.getAdminStats.mockResolvedValue(mockStats)

      const result = await memberService.getAdminStats()
      
      expect(mockMemberService.getAdminStats).toHaveBeenCalled()
      expect(result).toEqual(mockStats)
    })

    it('should throw error when service fails', async () => {
      mockMemberService.getAdminStats.mockRejectedValue(new Error('Erreur lors de la récupération des statistiques'))

      await expect(memberService.getAdminStats()).rejects.toThrow('Erreur lors de la récupération des statistiques')
    })
  })

  describe('createMember', () => {
    it('should create member successfully', async () => {
      const newMember = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone: '987654321',
        password: 'password123',
        role: 'MEMBER' as const
      }

      const createdMember = { 
        id: 2, 
        ...newMember, 
        status: 'ACTIVE' as const, 
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }

      mockMemberService.createMember.mockResolvedValue(createdMember)

      const result = await memberService.createMember(newMember)
      
      expect(mockMemberService.createMember).toHaveBeenCalledWith(newMember)
      expect(result).toEqual(createdMember)
    })

    it('should throw error when creation fails', async () => {
      const newMember = {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'jane@example.com',
        phone: '987654321',
        password: 'password123',
        role: 'MEMBER' as const
      }

      mockMemberService.createMember.mockRejectedValue(new Error('Email déjà utilisé'))

      await expect(memberService.createMember(newMember)).rejects.toThrow('Email déjà utilisé')
    })
  })
})
