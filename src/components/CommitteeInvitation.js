import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaChevronCircleRight, FaChevronDown, FaChevronRight, FaClock, FaEnvelope } from 'react-icons/fa';
import { EVALUATOR_APPLICANT_PROFILEPIC_URL } from '../backend/urls';
import { ApplicantViewContext } from '../context/ApplicantViewProvider';
import useApplicant from '../hooks/useApplicant';
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';

const CommitteeInvitation = ({ data, handleShowApplicants, preview = false }) => {

    const [viewApplicants, setViewApplicants] = useState(preview);

    const axiosEvaluator = useAxiosEvaluator();

    const applicantCount = data.applicants.length;

    const [selectedApplicant, setSelectedApplicant] = useState(preview ? data.applicants[0].id : null);

    const [profilePics, setProfilePics] = useState([]);

    const { applicant, setApplicant } = useApplicant();

    const fetchApplicantPics = () => {
        data.applicants.map((applicant, i) => {
            axiosEvaluator.post(EVALUATOR_APPLICANT_PROFILEPIC_URL, { id: applicant.id }, { responseType: 'blob' }).then((response) => {
                setProfilePics(prev => [...prev, URL.createObjectURL(response.data)])
            });
        });
    }

    useEffect(() => {
        if (preview) setApplicant(data.applicants[0]);
        fetchApplicantPics();
    }, []);

    const ApplicantPreview = ({ keyProp, applicant }) => {


        const [isSelected, setIsSelected] = useState(selectedApplicant === applicant.id);
        //const [profilePicUrl, setProfilePicUrl] = useState('');

        // const fetchProfilePic = () => {

        //     if (!profilePicUrl) {
        //         axiosEvaluator.post(EVALUATOR_APPLICANT_PROFILEPIC_URL, { id: applicant.id }, { responseType: 'blob' }).then((response) => {
        //             if (response.status !== 204) {
        //                 const url = URL.createObjectURL(response.data);
        //                 setProfilePicUrl(url);

        //             }

        //         }).catch((error) => { console.log(error) });
        //     }


        // }

        // useEffect(() => {
        //     fetchProfilePic();
        // }, []);  

        return (
            <div className={`flex p-4 w-full justify-between items-center cursor-pointer space-x-4 transition-all duration-300 ease-in-out ${isSelected ? 'bg-gray-100' : 'bg-white hover:bg-gray-100'} `}
                onClick={() => {
                    setSelectedApplicant(applicant.id);
                    localStorage.setItem('applicant', JSON.stringify(applicant));
                    setApplicant(applicant);
                }}>
                <div className='flex flex-row space-x-4'>
                    <div className='flex rounded-full bg-gray-300'>
                        <img src={profilePics[keyProp + 1]} alt='profile pic' className='w-8 h-8 object-cover rounded-full'></img>
                    </div>
                    <h2 className='text-gray-700 font-bold'>{applicant.firstName + ' ' + applicant.lastName}</h2>
                </div>

                <FaChevronRight color='gray' />
            </div>
        );
    }



    return (
        <div className={`flex flex-col w-full ${!preview && 'max-w-[600px]'} h-full bg-white py-4 justify-start items-start rounded-lg hover:shadow-lg transition-all duration-1000 ease-in-out`}>
            <div className="flex flex-col w-full px-6 bg-white justify-start items-start">
                <h2 className="font-bold text-gray-700 text-xl">{data.program_title}</h2>
                <h2 className="font-bold text-gray-500 -translate-y-[10%]">{data.title}</h2>
                <div className="flex space-x-2 mt-2 items-center">
                    <FaClock color="gray" />
                    <h2 className="text-sm text-gray-400">{data.end.split('T')[0]}</h2>
                </div>
            </div>


            {!preview ? <div className="flex w-full mt-6 items-center justify-between p-6  hover:bg-gray-100 transition-all duration-200 ease-in-out cursor-pointer" onClick={() => {
                setViewApplicants(!viewApplicants);
                handleShowApplicants();
            }}>
                <div className="flex items-center space-x-2">
                    <FaEnvelope color="gray" />
                    <h2 className="font-semibold text-gray-600">{`Προβολή Αιτήσεων (${applicantCount})`}</h2>
                </div>
            </div> :

                <div className='flex w-full items-center justify-start p-6 mt-6'>
                    <div className="flex items-center space-x-2">
                        <FaChevronDown color="gray" />
                        <h2 className="font-semibold text-gray-600">{`Λίστα Αιτήσεων (${applicantCount})`}</h2>
                    </div>
                </div>

            }

            {viewApplicants &&
                data.applicants.map((applicant, i) => {
                    return <ApplicantPreview key={applicant.id} keyProp={i} applicant={applicant} />
                })
            }

        </div>
    );
}

export default CommitteeInvitation