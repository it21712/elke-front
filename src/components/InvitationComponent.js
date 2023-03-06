import React, { useState } from 'react'
import { FaChevronDown, FaClock } from 'react-icons/fa';
import { APPLICANTS_APPLY_URL } from '../backend/urls';
import { applyInvitationText, invitationDescText, invitationEndDateText } from '../strings';

const InvitationComponent = ({ data, axiosRole }) => {
    const [showDesc, setShowDesc] = useState(false);
    const [apply, setApply] = useState(false);

    const handleApply = () => {
        const data = { id: data.id };

        axiosRole.post(APPLICANTS_APPLY_URL, data).then(response => {
            if (response.status === 200) {
                setApply(true);
            }
        }).catch(error => { console.error(error) });
    }

    return (
        <div className="p-4 bg-white rounded-lg flex flex-col shadow-lg">
            <div className="flex flex-col w-full px-6 bg-white justify-start items-start">
                <h2 className="font-bold text-gray-700 text-xl">{data.program_title}</h2>
                <h2 className="font-bold text-gray-500 -translate-y-[10%]">{data.title}</h2>

                <div className="flex flex-row space-x-2 mt-4 items-center">
                    <FaClock color="gray" />
                    <h2 className="font-bold text-gray-700">{invitationEndDateText}:</h2>
                    <h2 className="text-sm text-gray-500 font-semibold">{data.end.split('T')[0]}</h2>
                </div>

                <div className="flex flex-col mt-6 items-start">
                    <div className="flex flex-row justify-between items-center w-full cursor-pointer pl-2 pr-4 py-4 hover:bg-gray-100 border-b border-b-gray-300 transition-colors duration-200 ease-in mb-4"
                        onClick={() => setShowDesc(!showDesc)}>
                        <h2 className="font-bold text-gray-700">{invitationDescText}</h2>
                        <FaChevronDown className="w-5 h-5" color="gray" />
                    </div>
                    <div style={{ maxHeight: showDesc ? '400px' : 0 }} className="flex w-full overflow-hidden transition-all duration-500 ease-in-out mb-6">
                        <h2 className="font-bold text-gray-500 break-words text-left">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum</h2>
                    </div>
                </div>

                <div className={`${apply ? 'cursor-default bg-gray-300' : 'bg-gray-800 cursor-pointer hover:bg-gray-600'} p-4 rounded-md flex w-full items-center justify-center transition-colors duration-300 ease-in-out`}
                    onClick={() => { if (!apply) handleApply() }}>
                    <h2 className="font-bold text-white">{applyInvitationText}</h2>
                </div>

            </div>
        </div>
    );
}

export default InvitationComponent