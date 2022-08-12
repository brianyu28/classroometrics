import { useParams } from "react-router-dom";

function DashboardManager() {
    const params = useParams();
    const dashboardIdentifier = params.dashboardIdentifier;

    return (
        <div>
            <h2>Classroom Dashboard</h2>
            {dashboardIdentifier}
        </div>
    );
}

export default DashboardManager;
