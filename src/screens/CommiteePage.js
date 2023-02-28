import { memo, useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCheckCircle, FaChevronDown, FaChevronRight, FaClock, FaEnvelope, FaFontAwesome } from "react-icons/fa";
import { useNavigate, useNavigation } from "react-router-dom";
import { EVALUATOR_APPLICANT_INFO_URL, EVALUATOR_APPLICANT_PROFILEPIC_URL, EVALUATOR_VIEW_INVITATIONS_URL } from "../backend/urls";
import CommitteeInvitation from "../components/CommitteeInvitation";
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

    const [selectedInvitation, setSelectedInvitation] = useState(0);

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

            <div className="flex flex-row w-screen fixed top-16 bg-gray-200 h-full">
                <div className={`scrollbar-hide flex flex-col h-full ${showApplicants ? 'w-[50%] justify-start' : 'w-full justify-center'} border-r overflow-y-scroll items-center transition-all duration-300 ease-in-out`}>
                    <div className={`flex flex-col ${showApplicants ? 'w-full' : 'w-[60%]' } space-y-4 items-center`}>
                        {invitations ? invitations.map((invitation) => <CommitteeInvitation key={invitation.id} data={invitation} handleShowApplicants={
                            () => setShowApplicants(!showApplicants)}/>) : <></>}

                    </div>


                </div>
                {showApplicants &&
                    <div className="h-full w-[50%] border-l overflow-y-scroll">
                        
                            <div className="flex flex-col justify-center p-4 items-start">
                                <h2 className="text-gray-800 font-bold">{invitations[selectedInvitation].applicants[0].firstName + ' ' + invitations[selectedInvitation].applicants[0].lastName}</h2>
                                
                            </div>
                        
                    </div>
                }
            </div>
        </div>

    );
}

const InvitationComponent = ({ invitation, showApplicants, setShowApplicants }) => {

    const [viewApplicants, setViewApplicants] = useState(false);
    const navigate = useNavigate();
    const axiosEvaluator = useAxiosEvaluator();
    const applicantCount = invitation.applicants.length;


    const ApplicantPreview = ({ applicant }) => {
        const [profilePicUrl, setProfilePicUrl] = useState('');
        const fetchProfilePic = () => {

            axiosEvaluator.post(EVALUATOR_APPLICANT_PROFILEPIC_URL, { id: applicant.id }, { responseType: 'blob' }).then((response) => {
                if (response.status !== 204) {
                    const url = URL.createObjectURL(response.data);
                    setProfilePicUrl(url);
                }

            }).catch((error) => { console.log(error) });

        }

        useEffect(() => {
            fetchProfilePic();
        }, []);

        return (
            <div className='flex p-4 w-full bg-white justify-between items-center cursor-pointer space-x-4 transition-all duration-300 ease-in-out hover:bg-gray-100'>
                <div className='flex flex-row space-x-4'>
                    <div className='flex rounded-full bg-gray-300'>
                        <img src={!profilePicUrl ? '/unknown_avatar.png' : profilePicUrl} alt='profile pic' className='w-8 h-8 object-cover rounded-full'></img>
                    </div>
                    <h2 className='text-gray-700 font-bold'>{applicant.firstName + ' ' + applicant.lastName}</h2>
                </div>

                <FaChevronRight color='gray' />
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full bg-white py-4 justify-start items-start rounded-lg hover:shadow-lg transition-all duration-1000 ease-in-out">
            <div className="flex flex-col w-full px-6 bg-white justify-start items-start">
                <h2 className="font-bold text-gray-700 text-xl">{invitation.program_title}</h2>
                <h2 className="font-bold text-gray-500 -translate-y-[10%]">{invitation.title}</h2>
                <div className="flex space-x-2 mt-2 items-center">
                    <FaClock color="gray" />
                    <h2 className="text-sm text-gray-400">{invitation.end.split('T')[0]}</h2>
                </div>
            </div>


            <div className="flex w-full mt-6 items-center justify-between p-6  hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer" onClick={() => {
                
                
                setViewApplicants(!viewApplicants);
                setShowApplicants(!showApplicants);
            }}>
                <div className="flex items-center space-x-2">
                    <FaEnvelope color="gray" />
                    <h2 className="font-semibold text-gray-600">{`Προβολή Αιτήσεων (${applicantCount})`}</h2>
                </div>
            </div>

            {viewApplicants &&
                invitation.applicants.map((applicant) => {
                    return <ApplicantPreview key={applicant.id} applicant={applicant} />
                })
            }

        </div>
    );

    
}

export default CommiteePage;