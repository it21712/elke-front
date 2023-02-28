import React, { useContext, useEffect, useState } from 'react'
import { EVALUATOR_APPLICANT_INFO_URL } from '../backend/urls';
import useApplicant from '../hooks/useApplicant'
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';


const CommitteeApplicantFragment = () => {

    const { applicant, setApplicant } = useApplicant();

    const [applicantInfo, setApplicantInfo] = useState(null);

    const axiosEvaluator = useAxiosEvaluator();

    const fetchApplicantInfo = () => {
        applicant && axiosEvaluator.post(EVALUATOR_APPLICANT_INFO_URL, { id: applicant.id })
            .then(response => {
                if (response.status === 200) {
                    console.log(response.data);
                    setApplicantInfo(response.data);

                }
            })
            .catch(error => console.error(error));
    }

    useEffect(() => {
        fetchApplicantInfo();
    }, [applicant]);

    return (
        <div className='flex flex-col'>
            {applicant ? <h2>{applicant.firstName}</h2> : <></>}
        </div>


    )
}

export default CommitteeApplicantFragment