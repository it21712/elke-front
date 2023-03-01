import React, { useContext, useEffect, useState } from 'react'
import { FaMapMarker, FaMapPin } from 'react-icons/fa';
import { EVALUATOR_APPLICANT_FILES_URL, EVALUATOR_APPLICANT_INFO_URL, EVALUATOR_APPLICANT_PROFILEPIC_URL } from '../backend/urls';
import useApplicant from '../hooks/useApplicant'
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';
import { ChevronRightIcon, DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { AFRText, contactText, CRTsText, CVText, FLNsText, MCTText, PGDsText, PHDsText, UGDsText, uploadedFilesText, uploadFilesText, WXPsText } from '../strings';
import FILETYPES from '../backend/fileTypes';

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


    const FileCategoryButton = ({ category, fileType }) => {

        const [expanded, setExpanded] = useState(false);
        const [files, setFiles] = useState([]);
        const fetchApplicantFiles = () => {
            applicant && axiosEvaluator.post(EVALUATOR_APPLICANT_FILES_URL, { id: applicant.id, fileType: fileType })
                .then(response => {
                    setFiles(response.data);
                })
                .catch(error => console.error(error));
        }

        useEffect(() => {
            fetchApplicantFiles();
        }, [])

        return (
            <div className='flex flex-col w-full p-4 space-y-4 cursor-pointer hover:bg-gray-100  transition-all duration-500 ease-in-out' onClick={() => {
                setExpanded(!expanded);
            }}>
                <div className='flex flex-row items-center space-x-2'>
                    <ChevronRightIcon className={`w-6 h-6 ${expanded ? 'rotate-90' : 'rotate-0'} transition-all duration-300 ease-in-out`} color='gray' />
                    <h2 className='text-gray-700 font-bold text-lg'>{category}</h2>
                </div>

                {expanded &&
                    <div className='flex flex-row overflow-x-scroll scrollbar-hide space-x-2'>
                        {files.map((file) => {
                            return (
                                <div className='p-4 flex bg-slate-200 truncate max-w-[300px] rounded-lg hover:shadow-lg'>
                                    <h2 className='text-gray-500 font-bold truncate'>{file.file}</h2>
                                </div>
                            );
                        })}
                    </div>
                }
            </div>
        );

    }

    useEffect(() => {
        fetchApplicantInfo();
    }, [applicant]);

    return (
        <div className='flex flex-col bg-white rounded-lg shadow-lg overflow-y-scroll'>
            {fetching ? <h2>Loading</h2> :
                <div className='flex flex-col p-4 items-start justify-start'>
                    <div className='flex flex-row space-x-4 items-center'>
                        <div className='flex rounded-full bg-white mb-12 shadow-xl'>
                            <img src={applicantInfo['profile_pic']} alt='profile pic' className='w-28 h-28 object-cover rounded-full p-2'></img>
                        </div>

                    </div>
                    <h2 className='text-gray-700 font-bold text-2xl'>{applicantInfo.firstName + ' ' + applicantInfo.lastName}</h2>
                    <div className='flex flex-row space-x-2 items-center justify-start mt-2 -translate-x-1'>

                        <MapPinIcon className='w-5 h-5' color='gray' />
                        <h2 className='text-gray-500 text-base font-semibold'>{applicantInfo.country + ', ' + applicantInfo.city + ', ' +
                            applicantInfo.road + ' ' + applicantInfo.road_number + ', ' + applicantInfo.postal_code}</h2>
                    </div>

                    <h2 className='text-gray-700 font-semibold text-xl mt-12 mb-4'>{contactText}</h2>
                    <div className='flex flex-row space-x-4 items-center my-2'>
                        <EnvelopeIcon className='w-5 h-5' color='gray' fontSize={22} />
                        <h2 className='text-gray-700 font-semibold'>{applicantInfo.email}</h2>
                    </div>
                    <div className='flex flex-row space-x-4 items-center my-2'>
                        <PhoneIcon className='w-5 h-5' color='gray' fontSize={22} />
                        <h2 className='text-gray-700 font-semibold'>{applicantInfo.phone}</h2>
                    </div>
                    <div className='flex flex-row space-x-4 items-center my-2'>
                        <DevicePhoneMobileIcon className='w-5 h-5' color='gray' fontSize={22} />
                        <h2 className='text-gray-700 font-semibold'>{applicantInfo.cell_phone}</h2>
                    </div>

                    <h2 className='text-gray-700 font-semibold text-xl mt-12 mb-4'>{uploadedFilesText}</h2>

                    <FileCategoryButton category={UGDsText} fileType={FILETYPES.UNDER_GRAD_DIPLOMA} />
                    <FileCategoryButton category={PGDsText} fileType={FILETYPES.POST_GRAD_DIPLOMA} />
                    <FileCategoryButton category={PHDsText} fileType={FILETYPES.PHD_DIPLOMA} />
                    <FileCategoryButton category={CVText} fileType={FILETYPES.CV} />
                    <FileCategoryButton category={WXPsText} fileType={FILETYPES.WORK_EXPERIENCE} />
                    <FileCategoryButton category={CRTsText} fileType={FILETYPES.CERTIFICATE} />
                    <FileCategoryButton category={FLNsText} fileType={FILETYPES.FOREIGN_LANG} />
                    <FileCategoryButton category={MCTText} fileType={FILETYPES.MILITARY_CERT} />
                    <FileCategoryButton category={AFRText} fileType={FILETYPES.AFFIRMATION} />

                </div>
            }
        </div>


    )
}

export default CommitteeApplicantFragment