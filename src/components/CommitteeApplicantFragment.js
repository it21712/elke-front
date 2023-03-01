import React, { useContext, useEffect, useState } from 'react'
import { EVALUATOR_APPLICANT_INFO_URL, EVALUATOR_APPLICANT_PROFILEPIC_URL } from '../backend/urls';
import useApplicant from '../hooks/useApplicant'
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';


const CommitteeApplicantFragment = () => {

    const { applicant, setApplicant } = useApplicant();

    const [applicantInfo, setApplicantInfo] = useState(null);

    const axiosEvaluator = useAxiosEvaluator();

    const [fetching, setFetching] = useState(true);

    const fetchApplicantInfo = () => {
        applicant && axiosEvaluator.post(EVALUATOR_APPLICANT_INFO_URL, { id: applicant.id })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    setApplicantInfo(response.data);

                }
            })
            .catch(error => console.error(error));

        applicant && axiosEvaluator.post(EVALUATOR_APPLICANT_PROFILEPIC_URL, { id: applicant.id }, { responseType: 'blob' })
            .then(response => {
                if (response.status !== 204) {
                    const url = URL.createObjectURL(response.data);
                    setApplicantInfo(prevInfo => { return { ...prevInfo, profile_pic: url } });
                    setFetching(false);
                }
            });
    }

    useEffect(() => {
        fetchApplicantInfo();
    }, [applicant]);

    return (
        <div className='flex flex-col bg-white'>
            {fetching ? <h2>Loading</h2> :
                <div className='flex flex-row space-x-4 p-4 items-center'>
                    <div className='flex rounded-full bg-gray-300'>
                        <img src={applicantInfo['profile_pic']} alt='profile pic' className='w-24 h-24 object-cover rounded-full'></img>
                    </div>
                    <h2 className='text-gray-700 font-bold text-xl'>{applicantInfo.firstName + ' ' + applicantInfo.lastName}</h2>
                </div>}
        </div>


    )
}

export default CommitteeApplicantFragment