import { useEffect, useState } from "react";
import { APPLICANTS_APPLICATIONS_URL, APPLICANTS_APPLY_URL, APPLICANTS_VIEW_INVITATIONS_URL } from "../backend/urls";

import useAxiosRole from "../hooks/useAxiosRole";
import { applyInvitationText, expirationText, invitationDescText, invitationEndDateText, invitationStartDateText } from "../strings";
import { FaCheckCircle, FaChevronDown, FaChevronRight, FaClock, FaEnvelope } from "react-icons/fa";
import CommitteeInvitation from "./CommitteeInvitation";
import { FadeInListNest } from "./FadeInList";
import ApplicationComponent from "./ApplicationComponent";
const ApplicationsFragment = () => {
    const axiosRole = useAxiosRole();



    const [invitations, setInvitations] = useState(undefined);

    useEffect(() => {
        axiosRole.get(APPLICANTS_APPLICATIONS_URL).then(
            (response) => {
                setInvitations(response.data);
            }
        );
    }, []);

    return (
        // fix 2 scrollbars appearing and showing white bottom
        <div className="w-full h-screen flex flex-col bg-gray-200 items-center justify-start overflow-y-auto space-y-6 pt-10">

            {invitations &&
                <FadeInListNest tWrapperStyle={'w-full flex flex-col bg-gray-200 justify-start items-center overflow-y-auto pt-10'} delay={200}>
                    {invitations.map((invitation) => <div className="w-[50%] flex "><ApplicationComponent key={invitation.id} data={invitation} /> </div>)}
                </FadeInListNest>}
        </div>
    );
}

export default ApplicationsFragment;