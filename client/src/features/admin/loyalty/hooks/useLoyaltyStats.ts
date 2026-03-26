import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../lib/api-client';

export interface RankingMember {
    rank: number;
    userId: string;
    fullName: string;
    email: string;
    loyaltyPoints: number;
    membershipTier: 'BRONZE' | 'SILVER' | 'GOLD';
    avatar?: string;
    memberSince?: string;
    isActive?: boolean;
}

export interface TierOverview {
    tier: string;
    count: number;
    activeMembers: number;
}

/**
 * Get member ranking sorted by loyalty points
 */
export const useMemberRankingByPoints = (limit = 10) => {
    return useQuery({
        queryKey: ['memberRanking', 'points', limit],
        queryFn: async () => {
            const response = await apiClient.get('/loyalty/ranking/points', {
                params: { limit },
            });
            return response.data as RankingMember[];
        },
    });
};

/**
 * Get member ranking sorted by membership tier
 */
export const useMemberRankingByTier = (limit = 100) => {
    return useQuery({
        queryKey: ['memberRanking', 'tier', limit],
        queryFn: async () => {
            const response = await apiClient.get('/loyalty/ranking/tier', {
                params: { limit },
            });
            return response.data as RankingMember[];
        },
    });
};

/**
 * Get detailed member ranking with pagination and sorting
 */
export const useMemberRankingDetailed = (
    sortBy: 'points' | 'tier' = 'points',
    limit = 10,
) => {
    return useQuery({
        queryKey: ['memberRanking', 'detailed', sortBy, limit],
        queryFn: async () => {
            const response = await apiClient.get('/loyalty/ranking', {
                params: { sortBy, limit },
            });
            return response.data.data as RankingMember[];
        },
    });
};

/**
 * Calculate tier overview from ranking data
 * Groups members by tier and provides statistics
 */
export const calculateTierOverview = (
    members: RankingMember[],
): TierOverview[] => {
    const tierMap = new Map<string, { tier: string; count: number }>();

    members.forEach((member) => {
        const tier = member.membershipTier;
        if (!tierMap.has(tier)) {
            tierMap.set(tier, { tier, count: 0 });
        }
        const entry = tierMap.get(tier)!;
        entry.count += 1;
    });

    // Sort by tier hierarchy: GOLD > SILVER > BRONZE
    const tierOrder: Record<string, number> = { GOLD: 3, SILVER: 2, BRONZE: 1 };

    return Array.from(tierMap.values())
        .sort((a, b) => tierOrder[b.tier] - tierOrder[a.tier])
        .map((entry) => ({
            ...entry,
            activeMembers: entry.count, // All members in ranking are active
        }));
};

/**
 * Get tier stats from all members (mock calculation)
 * Since API doesn't have per-tier stats, we calculate from ranking data
 */
export const useTierStats = (limit = 1000) => {
    const { data: members, isLoading, error } = useMemberRankingByTier(limit);

    return {
        data: members ? calculateTierOverview(members) : [],
        isLoading,
        error,
        tierBreakdown: members
            ? {
                gold: members.filter((m) => m.membershipTier === 'GOLD').length,
                silver: members.filter((m) => m.membershipTier === 'SILVER').length,
                bronze: members.filter((m) => m.membershipTier === 'BRONZE').length,
            }
            : { gold: 0, silver: 0, bronze: 0 },
    };
};
