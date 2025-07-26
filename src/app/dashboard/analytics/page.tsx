
import { AnalyticsClient } from "@/components/dashboard/AnalyticsClient";

export default function AnalyticsPage() {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Analytics</h1>
            </div>
            <AnalyticsClient />
        </>
    );
}
