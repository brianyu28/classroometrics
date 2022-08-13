import { getDashboardForStudent } from "crmet/api/DashboardClient";
import { Dashboard } from "crmet/data/Dashboard";
import { Error } from "crmet/data/Error";
import MajorElementsViewer from "crmet/major-elements-viewer";
import { useEffect, useState } from "react";
import MinorElementsViewer from "../minor-elements-viewer";

interface RoomViewerProps {
    identifier: string
};

function RoomViewer({
    identifier
}: RoomViewerProps) {

    const [dashboard, setDashboard] = useState<Dashboard | null>(null);

    const reloadDashboard = () => {
        getDashboardForStudent(identifier)
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

    if (dashboard === null) {
        return <div></div>;
    }

    return (
        <div>
            {dashboard.groups.length > 0 &&
                <MajorElementsViewer
                elements={dashboard.groups[0]}
                />
            }
            {dashboard.groups.length > 1 &&
                dashboard.groups.slice(1).map((group, i) => (
                <MinorElementsViewer
                    key={i}
                    elements={group}
                />
                ))
            }
        </div>
    );
}

export default RoomViewer;
