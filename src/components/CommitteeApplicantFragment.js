import React, { useEffect, useRef, useState } from 'react'
import { EVALUATOR_APPLICANT_FILES_URL, EVALUATOR_APPLICANT_INFO_URL, EVALUATOR_APPLICANT_PROFILEPIC_URL, EVALUATOR_DOWNLOAD_FILE_URL } from '../backend/urls';
import useApplicant from '../hooks/useApplicant'
import useAxiosEvaluator from '../hooks/useAxiosEvaluator';
import { ChevronRightIcon, DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon, PhoneIcon, EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import { AFRText, contactText, CRTsText, CVText, FLNsText, MCTText, PGDsText, PHDsText, UGDsText, uploadedFilesText, WXPsText } from '../strings';
import FILETYPES from '../backend/fileTypes';
import { FadeInListNest } from './FadeInList';

const CommitteeApplicantFragment = () => {

    const { applicant, setApplicant } = useApplicant();

    const [applicantInfo, setApplicantInfo] = useState(null);

    const axiosEvaluator = useAxiosEvaluator();

    const [fetching, setFetching] = useState(true);

    const fetchApplicantInfo = () => {
        applicant && axiosEvaluator.post(EVALUATOR_APPLICANT_INFO_URL, { id: applicant.id })
            .then(response => {
                if (response.status === 200) {
                    //console.log(response.data);
                    //setApplicantInfo(response.data);
                    let data = response.data;
                    axiosEvaluator.post(EVALUATOR_APPLICANT_PROFILEPIC_URL, { id: applicant.id }, { responseType: 'blob' })
                        .then(response => {
                            if (response.status !== 204) {
                                const url = URL.createObjectURL(response.data);
                                //setApplicantInfo(prevInfo => { return { ...prevInfo, profile_pic: url } });
                                data.profile_pic = url;
                                setApplicantInfo(data);
                                console.warn(applicantInfo);
                                setFetching(false);

                            }
                        });
                }
            })
            .catch(error => console.error(error));


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

        const FilePreview = ({ file }) => {

            const handleFileDownload = () => {
                axiosEvaluator.get(EVALUATOR_DOWNLOAD_FILE_URL, { params: { file_id: file.id }, responseType: 'blob' }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    // set the file name
                    const filename = response.headers['content-disposition'].split('filename=')[1];
                    link.setAttribute('download', filename);
                    document.body.appendChild(link);
                    link.click();
                });
            }

            return (
                <div className='group p-4 flex flex-row bg-slate-200 max-w-[300px] rounded-lg space-x-2 items-center' onClick={handleFileDownload}>
                    <h2 className='text-gray-500 font-bold truncate'>{file.file}</h2>
                    <EllipsisVerticalIcon className='h-6 w-6' color='gray' />
                </div>
            );

        }

        return (
            <div className='flex flex-col w-full p-2 space-y-2 cursor-pointer hover:bg-gray-100 group transition-all duration-500 ease-in-out'>
                <div className='flex flex-row items-center space-x-2 group-hover:translate-x-2 transition-all duration-200 ease-in-out' onClick={() => {
                    setExpanded(!expanded);
                }}>
                    <ChevronRightIcon className={`w-6 h-6 ${expanded ? 'rotate-90' : 'rotate-0'} transition-all duration-300 ease-in-out`} color='gray' />
                    <h2 className='text-gray-700 font-bold text-lg'>{category}</h2>

                </div>
                {

                    <div style={{ maxHeight: expanded ? '400px' : 0 }} className={`flex flex-row overflow-x-auto space-x-2 transition-all ease-in-out ${expanded ? 'duration-700' : 'duration-200'}`}>
                        {files.map((file, i) => {
                            return (
                                <FilePreview key={i} file={file} />
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
        <div className='flex flex-col bg-white rounded-lg w-full overflow-y-auto'>
            {fetching ? <></> :
                <div className='flex flex-col px-4 pt-4 pb-14 items-start justify-start'>
                    {applicantInfo && <FadeInListNest key={applicantInfo.profile_pic} delay={100} tWrapperStyle='flex flex-col p-4 items-start justify-start w-full h-full'>
                        <div className='flex flex-row space-x-4 items-center w-full'>
                            <div className='flex rounded-full bg-white mb-12 shadow-xl'>
                                <img src={applicantInfo['profile_pic']} alt='profile pic' className='w-28 h-28 object-cover rounded-full p-2'></img>
                            </div>

                        </div>
                        <div className='flex flex-col justify-start items-start'>
                            <h2 className='text-gray-700 font-bold text-2xl'>{applicantInfo.firstName + ' ' + applicantInfo.lastName}</h2>

                            <div className='flex flex-row space-x-2 items-center justify-start -translate-x-1 w-full'>

                                <MapPinIcon className='w-5 h-5' color='gray' />
                                <h2 className='text-gray-500 text-base font-semibold'>{applicantInfo.country + ', ' + applicantInfo.city + ', ' +
                                    applicantInfo.road + ' ' + applicantInfo.road_number + ', ' + applicantInfo.postal_code}</h2>
                            </div>
                        </div>


                        <span className='flex w-full border-b border-b-gray-300'>
                            <h2 className='text-gray-700 font-semibold text-xl mt-12 mb-4'>{contactText}</h2>
                        </span>

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

                        <span className='flex w-full border-b border-b-gray-300'>
                            <h2 className='text-gray-700 font-semibold text-xl mt-12 mb-4'>{uploadedFilesText}</h2>
                        </span>
                        <FileCategoryButton category={UGDsText} fileType={FILETYPES.UNDER_GRAD_DIPLOMA} />
                        <FileCategoryButton category={PGDsText} fileType={FILETYPES.POST_GRAD_DIPLOMA} />
                        <FileCategoryButton category={PHDsText} fileType={FILETYPES.PHD_DIPLOMA} />
                        <FileCategoryButton category={CVText} fileType={FILETYPES.CV} />
                        <FileCategoryButton category={WXPsText} fileType={FILETYPES.WORK_EXPERIENCE} />
                        <FileCategoryButton category={CRTsText} fileType={FILETYPES.CERTIFICATE} />
                        <FileCategoryButton category={FLNsText} fileType={FILETYPES.FOREIGN_LANG} />
                        <FileCategoryButton category={MCTText} fileType={FILETYPES.MILITARY_CERT} />
                        <FileCategoryButton category={AFRText} fileType={FILETYPES.AFFIRMATION} />
                    </FadeInListNest>}





                </div>
            }
        </div>


    )
}

export default CommitteeApplicantFragment