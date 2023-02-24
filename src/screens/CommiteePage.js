import { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCheckCircle, FaFontAwesome } from "react-icons/fa";
import { useNavigate, useNavigation } from "react-router-dom";
import { EVALUATOR_VIEW_INVITATIONS_URL } from "../backend/urls";
import useAxiosEvaluator from "../hooks/useAxiosEvaluator";
import { applicantPreviewRoute, committeeRoute } from "../routes";
import { expirationText, logoutText, viewApplicantsText } from "../strings";
import './CommitteePage.css';
const CommiteePage = () => {

    const testEvaluator = {
        name: 'Thomas Kamalakis',
        email: 'thkam@app.com',
    };

    const axiosEvaluator = useAxiosEvaluator();

    const [invitations, setInvitations] = useState(undefined);

    const fetchInvitations = () => {
        axiosEvaluator.get(EVALUATOR_VIEW_INVITATIONS_URL).then((response => {
            console.log(response.data);
            setInvitations(response.data);
        })).catch(error => console.error(error));
    }

    useEffect(() => {
        fetchInvitations();
    }, []);

    // return (
    //     <div className="flex flex-row w-screen h-screen bg-gray-200">
    //         <div className="flex h-full w-[50%] border-r border-gray-300 overflow-y-scroll">
    //             <div className='flex flex-col mt-12 mx-auto min-w-[600px] w-full h-full max-w-[80%]'>
    //                 {invitations ? invitations.map((invitation) => <InvitationComponent key={invitation.id} invitation={invitation} />) : <></>}
    //             </div>

    //         </div>
    //         <div className="h-full w-[50%] border-l border-gray-300 overflow-y-scroll"></div>
    //     </div>
    // );

    return (
        <div className='flex h-screen w-screen bg-gray-200 overflow-y-scroll'>
            <div className="flex bg-gray-800 shadow-md fixed w-full z-10 top-0 h-16 px-4 justify-between items-center">
                <h2 className='font-semibold invisible sm:visible text-white my-auto text-lg'>{testEvaluator.name}</h2>
                <div className='flex justify-center items-center'>

                    <div className='cursor-pointer flex bg-gray-800 rounded-md px-2 py-[6px] bo rder-white border-2 hover:bg-gray-700'>
                        <h2 className='text-white'>{logoutText}</h2>

                    </div>
                </div>

            </div>

            <div className='flex flex-col w-full h-full '>
                <h2 className='mt-28 text-xl font-bold text-stone-600'>Βλέπετε ενεργές και μη Προσκλήσεις</h2>
                <div className='flex flex-col mt-12 mx-auto min-w-[600px] w-full h-full max-w-[50%]'>
                    {invitations ? invitations.map((invitation) => <InvitationComponent key={invitation.id} invitation={invitation} />) : <></>}

                </div>

            </div>
        </div>
    );
}

const ApplicantView = ({ applicant }) => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(committeeRoute + applicantPreviewRoute, { state: { applicant } });
    }

    return (
        <span className='flex mb-6 cursor-pointer border-b border-b-stone-300 w-full' onClick={handleClick}>
            <h2 className='text-base font-semibold text-gray-600 p-2  hover:translate-x-2 transition ease-in-out duration-300' key={applicant.id}>{applicant.firstName + ' ' + applicant.lastName}</h2>
        </span>
    );
}

export const InvitationComponent = ({ invitation }) => {


    const [viewApplicants, setViewApplicants] = useState(false);

    const navigate = useNavigate();

    const handleAllApplicantsPreview = () => {
        navigate(committeeRoute + applicantPreviewRoute, { state: { applicants: invitation.applicants, title: invitation.title } });
    }

    const ActionButton = ({ content, handleClick }) => {
        return (
            <div className="flex p-4 cursor-pointer rounded-md bg-stone-400 justify-center items-center hover:drop-shadow-xl transition-all duration-300 ease-in-out"
                onClick={handleClick}>
                {content}
            </div>
        );
    }

    return (
        <div className={`mb-20 mx-auto flex flex-col md:w-[70%] w-[90%] min-h-[250px] bg-white drop-shadow-md transition-all ease-in-out duration-500 hover:-translate-y-1 hover:shadow-lg`}>
            <span className='flex px-6 justify-between items-center w-full min-h-[50px] bg-stone-300'>
                <h1 className='text-xl font-sans font-medium text-gray-800'>{invitation.title}</h1>
                <h2 className='text-sm text-gray-700'>{invitation.start.split('T')[0]}</h2>
            </span>
            <div className='flex flex-col pl-6 mt-2 w-full items-start justify-start'>
                <h2 className='font-sans text-base mt-10 '>{invitation.program_title}</h2>
                <span className='flex justify-start items-center w-full mt-8'>
                    <h2 className='text-lg'>{expirationText}</h2>
                    <h2 className='pl-8 tex-base font-mono'>{invitation.end.split('T')[0]}</h2>

                </span>
                <div className='flex flex-col w-full justify-start mt-6 transition-all ease-in-out duration-500'>
                    <div className='flex justify-center items-center space-x-6 mb-6 w-full' onClick={() => { setViewApplicants(!viewApplicants) }}>
                        {/* <ActionButton
                            content={<div className="flex flex-row">
                                <h2 className='flex text-white font-bold mr-2'>Show Applicants</h2>
                                <div className='flex justify-center items-center mr-2'>
                                    {!viewApplicants ? <FaArrowDown color="white" fontSize={20} /> : <FaArrowUp color="white" fontSize={20} />}
                                </div>
                            </div>} /> */}

                        <ActionButton content={<h2 className='flex text-white font-semibold mr-2'>{viewApplicantsText}</h2>}
                            handleClick={handleAllApplicantsPreview} />


                    </div>
                    <div className='flex flex-col justify-start items-start w-full transition-all ease-in-out duration-500 overflow-y-scroll' style={{ maxHeight: viewApplicants ? '500px' : 0 }}>
                        {invitation.applicants ? invitation.applicants.map((applicant) => <ApplicantView key={applicant.id} applicant={applicant} />) : <></>}
                    </div>
                </div>
            </div>

        </div >
    );


}

export default CommiteePage;