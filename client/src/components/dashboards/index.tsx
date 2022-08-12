import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getDashboards } from "crmet/api/DashboardClient";
import CreateDashboard from "crmet/components/create-dashboard";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Dashboard } from "crmet/data/Dashboard";

function Dashboards() {

    const { userAuth } = useContext(UserAuthContext);
    const [dashboards, setDashboards] = useState<Dashboard[]>([]);

    const refreshDashboards = () => {
        getDashboards(userAuth)
        .then(res => res.json())
        .then((dashboards: Dashboard[])  => {
            setDashboards(dashboards);
        });
    };

    useEffect(refreshDashboards, []);

    return (
        <div>
            Rooms
            <ul>
                {dashboards.map(dashboard =>
                    <li key={dashboard.id}>
                        <Link to={`/app/rooms/${dashboard.identifier}`}>
                            {dashboard.identifier}
                        </Link>
                    </li>
                )}
            </ul>
            <CreateDashboard />
        </div>
    );
}

export default Dashboards;
