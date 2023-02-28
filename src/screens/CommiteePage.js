import { createContext, memo, useContext, useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCheckCircle, FaChevronDown, FaChevronLeft, FaChevronRight, FaClock, FaEnvelope, FaFontAwesome } from "react-icons/fa";
import { json, useNavigate, useNavigation } from "react-router-dom";
import { EVALUATOR_APPLICANT_INFO_URL, EVALUATOR_APPLICANT_PROFILEPIC_URL, EVALUATOR_VIEW_INVITATIONS_URL } from "../backend/urls";
import CommitteeApplicantFragment from "../components/CommitteeApplicantFragment";
import CommitteeInvitation from "../components/CommitteeInvitation";
import FadeInList from "../components/FadeInList";
import { ApplicantViewContext, ApplicantViewProvider } from "../context/ApplicantViewProvider";
import useAxiosEvaluator from "../hooks/useAxiosEvaluator";
import { applicantPreviewRoute, committeeRoute } from "../routes";
import { appTitle, expirationText, logoutText, viewApplicantsText } from "../strings";
import './CommitteePage.css';




const CommiteePage = () => {

    const testEvaluator = {
        name: 'Thomas Kamalakis',
        email: 'thkam@app.com',
    };

    const axiosEvaluator = useAxiosEvaluator();

    const [showApplicants, setShowApplicants] = useState(false);

    const [invitations, setInvitations] = useState(undefined);

    const [viewInvitationList, setViewInvitationList] = useState(true);

    const fetchInvitations = () => {
        axiosEvaluator.get(EVALUATOR_VIEW_INVITATIONS_URL).then((response => {

            setInvitations(response.data);
        })).catch(error => console.error(error));
    }


    useEffect(() => {
        fetchInvitations();
    }, []);


    return (
        <div className="flex flex-col w-screen h-screen">
            <div className="flex bg-gray-800 shadow-md fixed w-full z-10 top-0 px-3 h-16">
                <h3 className='font-semibold invisible sm:visible text-white my-auto'>{appTitle}</h3>
            </div>

            {/* {viewInvitationList ? <InvitationListViewFragment setViewInvitationList={setViewInvitationList} /> : */}
            {viewInvitationList ? <InvitationListViewFragment setViewInvitationList={setViewInvitationList} /> :
                <InvitationViewFragment setViewInvitationList={setViewInvitationList} />}

        </div>
    );
    // return (
    //     <div className="flex flex-col w-screen h-screen">

    //         <div className="flex bg-gray-800 shadow-md fixed w-full z-10 top-0 px-3 h-16">
    //             <h3 className='font-semibold invisible sm:visible text-white my-auto'>{appTitle}</h3>
    //         </div>

    //         <div className="flex flex-row w-screen fixed top-16 bg-gray-200 h-full">
    //             <div className={`scrollbar-hide flex flex-col h-full ${showApplicants ? 'w-[50%]' : 'w-full mt-[10%]'} justify-start border-r overflow-y-scroll items-center transition-all duration-300 ease-in-out`}>
    //                 <div className={`flex flex-col ${showApplicants ? 'w-full' : 'w-[60%]'} space-y-4 items-center`}>
    //                     {invitations ? invitations.map((invitation) => <CommitteeInvitation key={invitation.id} data={invitation} handleShowApplicants={
    //                         () => setShowApplicants(!showApplicants)} />) : <></>}

    //                 </div>


    //             </div>
    //             {showApplicants &&
    //                 <div className="h-full w-[50%] border-l overflow-y-scroll">

    //                     {/* <div className="flex flex-col justify-center p-4 items-start">
    //                         <h2 className="text-gray-800 font-bold">{invitations[selectedInvitation].applicants[0].firstName + ' ' + invitations[selectedInvitation].applicants[0].lastName}</h2>

    //                     </div> */}

    //                 </div>
    //             }
    //         </div>
    //     </div>

    // );
}

export const InvitationListViewFragment = ({ setViewInvitationList }) => {

    const [invitations, setInvitations] = useState(undefined);
    const axiosEvaluator = useAxiosEvaluator();

    const fetchInvitations = () => {
        axiosEvaluator.get(EVALUATOR_VIEW_INVITATIONS_URL).then((response => {

            setInvitations(response.data);
        })).catch(error => console.error(error));
    }


    useEffect(() => {
        fetchInvitations();
    }, []);


    const handleShowApplicants = (invitation) => { localStorage.setItem('invitation', JSON.stringify(invitation)); setViewInvitationList(false); }

    return (
        <div className="flex flex-row w-screen fixed top-16 bg-gray-200 h-full">
            <div className={`scrollbar-hide flex flex-col h-full w-full mt-[10%] justify-start border-r overflow-y-scroll items-center transition-all duration-300 ease-in-out`}>
                {/* <div className={`flex flex-col w-[60%] space-y-4 items-center`}>
                    {invitations ? invitations.map((invitation) => <CommitteeInvitation key={invitation.id} data={invitation} handleShowApplicants={() => handleShowApplicants(invitation)} />) : <></>}
                </div> */}
                <div className={`flex flex-col w-[60%] space-y-4 items-center`}>
                    {invitations && <FadeInList tWrapperStyle={'flex flex-col w-[60%] space-y-4 items-center'} items={invitations.map((invitation) => <CommitteeInvitation key={invitation.id} data={invitation} handleShowApplicants={() => handleShowApplicants(invitation)} />)} />}

                </div>


            </div>
        </div>
    );
}


export const InvitationViewFragment = ({ setViewInvitationList }) => {

    const invitation = JSON.parse(localStorage.getItem('invitation'));
    console.log(invitation);

    //const [currentApplicant, setCurrentApplicant] = useState({});

    return (
        <ApplicantViewProvider>
            <div className="flex flex-row w-full fixed top-16 h-full bg-gray-200">
                <div className="flex-col w-[50%] space-y-6 h-full overflow-scroll scrollbar-hide">
                    <div className="flex flex-row w-full space-x-6 p-2 items-center justify-start bg-white rounded-b-md cursor-pointer hover:bg-gray-100 transition duration-300 ease-in-out" onClick={() => setViewInvitationList(true)}>
                        <div className="flex items-center justify-center p-2 rounded-full">
                            <FaChevronLeft color="gray" />
                        </div>
                        <h2 className="text-gray-800 font-bold text-lg">Back to Invitations</h2>
                    </div>

                    <div className="flex w-full">

                        <CommitteeInvitation data={invitation} preview={true} />


                    </div>


                </div>


                <div className="flex flex-col w-[50%] space-y-6 h-full overflow-scroll scrollbar-hide">
                    <CommitteeApplicantFragment />
                </div>
            </div>
        </ApplicantViewProvider>
    );
}


export default CommiteePage;