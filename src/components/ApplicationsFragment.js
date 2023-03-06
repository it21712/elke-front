import { useEffect, useState } from "react";
import { APPLICANTS_APPLICATIONS_URL, APPLICANTS_APPLY_URL, APPLICANTS_VIEW_INVITATIONS_URL } from "../backend/urls";

import useAxiosRole from "../hooks/useAxiosRole";
import { applyInvitationText, expirationText, invitationDescText, invitationEndDateText, invitationStartDateText } from "../strings";
import { FaCheckCircle, FaChevronDown, FaChevronRight, FaClock, FaEnvelope } from "react-icons/fa";
import CommitteeInvitation from "./CommitteeInvitation";
import { FadeInListNest } from "./FadeInList";
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

    const InvitationComponent = ({ invitation }) => {

        const [showDesc, setShowDesc] = useState(false);
        return (
            <div className="p-4 bg-white rounded-lg flex flex-col shadow-lg">
                <div className="flex flex-col w-full px-6 bg-white justify-start items-start">
                    <h2 className="font-bold text-gray-700 text-xl">{invitation.program_title}</h2>
                    <h2 className="font-bold text-gray-500 -translate-y-[10%]">{invitation.title}</h2>

                    <div className="flex flex-row space-x-2 mt-4 items-center">
                        <FaClock color="gray" />
                        <h2 className="font-bold text-gray-700">{invitationEndDateText}:</h2>
                        <h2 className="text-sm text-gray-500 font-semibold">{invitation.end.split('T')[0]}</h2>
                    </div>

                    <div className="flex flex-col mt-6 items-start">
                        <div className="flex flex-row justify-between items-center w-full cursor-pointer pl-2 pr-4 py-4 hover:bg-gray-100 border-b border-b-gray-300 transition-colors duration-200 ease-in mb-4"
                            onClick={() => setShowDesc(!showDesc)}>
                            <h2 className="font-bold text-gray-700">{invitationDescText}</h2>
                            <FaChevronDown className="w-5 h-5" color="gray" />
                        </div>
                        <div style={{ maxHeight: showDesc ? '400px' : 0 }} className="flex w-full overflow-hidden transition-all duration-500 ease-in-out mb-6">
                            <h2 className="font-bold text-gray-500 break-words text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</h2>
                        </div>
                    </div>

                </div>
            </div>
        );
    }


    return (
        // fix 2 scrollbars appearing and showing white bottom
        <div className="w-full h-screen flex flex-col bg-gray-200 items-center justify-start overflow-y-auto space-y-6 pt-10">

            {invitations &&
                <FadeInListNest tWrapperStyle={'w-full flex flex-col bg-gray-200 justify-start items-center overflow-y-auto pt-10'} delay={200}>
                    {invitations.map((invitation) => <div className="w-[50%] flex "><InvitationComponent key={invitation.id} invitation={invitation} /> </div>)}
                </FadeInListNest>}
        </div>
    );
}

export default ApplicationsFragment;