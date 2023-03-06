import { useEffect, useState } from "react";
import { APPLICANTS_APPLY_URL, APPLICANTS_VIEW_INVITATIONS_URL } from "../backend/urls";

import useAxiosRole from "../hooks/useAxiosRole";
import { expirationText } from "../strings";
import { FaCheckCircle } from "react-icons/fa";
const InvitationsFragment = () => {
    const axiosRole = useAxiosRole();



    const [invitations, setInvitations] = useState(undefined);

    useEffect(() => {
        axiosRole.get(APPLICANTS_VIEW_INVITATIONS_URL).then(
            (response) => {
                setInvitations(response.data);
            }
        );
    }, []);

    const InvitationComponent = ({ invitation }) => {
        return (
            <div></div>
        );
    }

    // const InvitationComponent = ({ invitation }) => {

    //     const [apply, setApply] = useState(false);

    //     const handleApply = () => {
    //         const data = { id: invitation.id };

    //         axiosRole.post(APPLICANTS_APPLY_URL, data).then(response => {
    //             if (response.status === 200) {
    //                 setApply(true);
    //             }
    //         }).catch(error => { console.error(error) });
    //     }

    //     return (
    //         <div className={`mb-20 mx-auto ${apply ? 'transition  duration-300 opacity-60 ' : 'opacity-100 '} flex flex-col md:w-[60%] w-[90%] h-[30%] min-h-[250px] bg-white rounded-t-2xl rounded-b-2xl drop-shadow-md ${apply ? 'cursor-default ' : 'cursor-pointer '} transition-all ease-in-out duration-500 hover:-translate-y-1 hover:shadow-lg`}>
    //             <span className='flex px-6 justify-between items-center w-full h-[20%] bg-stone-300'>
    //                 <h1 className='text-xl font-sans font-medium text-gray-800'>{invitation.title}</h1>
    //                 <h2 className='text-sm text-gray-700'>{invitation.start.split('T')[0]}</h2>
    //             </span>
    //             <div className='flex flex-col pl-6 mt-2 w-full items-start justify-start'>
    //                 <h2 className='font-sans text-base mt-10 '>{invitation.program_title}</h2>
    //                 <span className='flex justify-start items-center w-full mt-8'>
    //                     <h2 className='text-lg'>{expirationText}</h2>
    //                     <h2 className='pl-8 tex-base font-mono'>{invitation.end.split('T')[0]}</h2>
    //                 </span>
    //                 <span className='flex w-full justify-end '>
    //                     {!apply ? <div className='flex cursor-pointer  p-2 rounded-lg mr-4 bg-stone-500' onClick={handleApply}>
    //                         <h2 className='text-white'>Apply Now</h2>
    //                     </div> : <div className='flex justify-end p-2 mr-4 rounded-lg'>
    //                         <div className='flex m-auto w-full h-full'><FaCheckCircle color='green' size={22} /></div></div>}
    //                 </span>
    //             </div>

    //         </div>
    //     );


    // }

    return (
        <div className='w-full h-full flex flex-col bg-gray-200 overflow-y-scroll'>
            <div className='w-full h-full mt-12'>
                {invitations ? invitations.map((invitation) => <InvitationComponent key={invitation.id} invitation={invitation} />) : <></>}
            </div>

        </div>
    );
}

export default InvitationsFragment;