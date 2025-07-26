"use client"

import { useState, useEffect } from "react"
import { AnalyticsDashboard } from "@/components/dashboard/AnalyticsDashboard"
import { AnalyticsData } from "@/lib/types"

export function AnalyticsClient() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/analytics')
                if (response.ok) {
                    const data = await response.json()
                    setAnalyticsData(data)
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!analyticsData) {
        return (
            <div className="text-center text-muted-foreground">
                Failed to load analytics data
            </div>
        )
    }

    return <AnalyticsDashboard analyticsData={analyticsData} />
}
