import React, { useEffect, useState } from 'react'
import { FaChevronCircleRight, FaChevronRight, FaClock, FaEnvelope } from 'react-icons/fa';
import { EVALUATOR_APPLICANT_PROFILEPIC_URL } from '../backend/urls';
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';

const CommitteeInvitation = ({ data, handleShowApplicants }) => {

    const [viewApplicants, setViewApplicants] = useState(false);

    const axiosEvaluator = useAxiosEvaluator();

    const applicantCount = data.applicants.length;

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
            <div className='flex p-4 w-full bg-white justify-between items-center cursor-pointer space-x-4 transition-all duration-300 ease-in-out hover:bg-gray-100'
                onClick={() => {
                    //todo use redux to set applicant info in store or context 
                
                }}>
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
                <h2 className="font-bold text-gray-700 text-xl">{data.program_title}</h2>
                <h2 className="font-bold text-gray-500 -translate-y-[10%]">{data.title}</h2>
                <div className="flex space-x-2 mt-2 items-center">
                    <FaClock color="gray" />
                    <h2 className="text-sm text-gray-400">{data.end.split('T')[0]}</h2>
                </div>
            </div>


            <div className="flex w-full mt-6 items-center justify-between p-6  hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer" onClick={() => {
                setViewApplicants(!viewApplicants);
                handleShowApplicants();
            }}>
                <div className="flex items-center space-x-2">
                    <FaEnvelope color="gray" />
                    <h2 className="font-semibold text-gray-600">{`Προβολή Αιτήσεων (${applicantCount})`}</h2>
                </div>
            </div>

            {viewApplicants &&
                data.applicants.map((applicant) => {
                    return <ApplicantPreview key={applicant.id} applicant={applicant} />
                })
            }

        </div>
    );
}

export default CommitteeInvitation