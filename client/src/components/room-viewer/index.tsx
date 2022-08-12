import { getDashboard } from "crmet/api/DashboardClient";
import { Dashboard } from "crmet/data/Dashboard";
import { Error } from "crmet/data/Error";
import { useEffect, useState } from "react";

interface RoomViewerProps {
    identifier: string
};

export function RoomViewer({
    identifier
}: RoomViewerProps) {

    const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    const reloadDashboard = () => {
        getDashboard(identifier)
        .then(res => res.json())
        .then((data: Dashboard | Error) => {
            if ('error' in data) {
                console.log(data.error);
                return;
            }
            setDashboard(data);
        })
    };

    useEffect(reloadDashboard, [identifier]);

    console.log(dashboard);

    if (dashboard === null) {
        return <div></div>;
    }

    return (
        <div>
            Identifier: {identifier}
            <div>
                {dashboard.groups.map((group, i) => {
                    return (
                        <div>
                            {group.map((element, j) => {
                                return (
                                    <div>
                                        {element.identifier}
                                    </div>
                                );
                            }}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
