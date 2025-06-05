import { useUser } from "@clerk/nextjs";
import { useUserMetrics } from "@/hooks";

function DashboardPage() {

    const { user } = useUser();
    const userId = user?.id || '';

    const { data: metrics, isLoading, error } = useUserMetrics(userId);

    return (
    )
}

export default DashboardPage;