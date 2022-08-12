import { createDashboard } from "crmet/api/DashboardClient";
import UserAuthContext from "crmet/contexts/UserAuthContext";
import { Dashboard } from "crmet/data/Dashboard";
import { Error } from "crmet/data/Error";
import { useInputFieldState } from "crmet/util/hooks";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateDashboard() {

    const { userAuth } = useContext(UserAuthContext);
    const [identifier, setIdentifier, updateIdentifier] = useInputFieldState('');
    const [title, setTitle, updateTitle] = useInputFieldState('');
    const navigate = useNavigate();

    const createNewDashboard = (event: React.FormEvent) => {
        event.preventDefault();
        if (identifier === '') {
            return;
        }

        createDashboard(userAuth, identifier, title)
        .then(res => res.json())
        .then((data: Dashboard | Error) => {
            if ('error' in data) {
                console.log(data.error);
            } else {
                navigate(`/app/dashboards/${data.identifier}`);
            }
        });
        return false;
    };

    const canSubmitCreateDashboardForm = identifier !== '' && title !== '';

    return (
        <div>
            <h2>Create a New Dashboard</h2>
            <form onSubmit={createNewDashboard}>
                <input type="text" value={identifier} onChange={updateIdentifier} placeholder="Identifier" />
                <input type="text" value={title} onChange={updateTitle} placeholder="Title" />
                <input disabled={!canSubmitCreateDashboardForm} type="submit" value="Create" />
            </form>
        </div>
    );
}

export default CreateDashboard;
