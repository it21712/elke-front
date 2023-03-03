import { useState, useRef, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { cellPhoneText, cityText, contactText, countryText, dateOfBirthText, detailsSubmitText, firstNameText, lastNameText, phoneText, roadNameText, roadNumberText, tkText, uploadedFilesText } from "../strings";
import { RequiredFieldValidator, TextOnlyValidator, WordOnlyValidator } from "../validators/Validators";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { APPLICANT_DETAILS_URL, APPLICANT_PROFILEPIC_URL } from "../backend/urls";
import { FaPen, FaEnvelope, FaPhone, FaMobile } from "react-icons/fa";

import useAxiosRole from "../hooks/useAxiosRole";

export const ProfileAvatar = ({ picUrl }) => {

    return (
        <div className='flex w-full h-full items-center justify-center '>
            <img src={!picUrl ? '/unknown_avatar.png' : picUrl} alt='profile pic' className='w-full h-full object-cover rounded-full'></img>
        </div>
    );
}

const UserDetailsFragment = ({ email }) => {

    const [details, setDetails] = useState(undefined);
    const [editDetails, setEditDetails] = useState(false);

    const getDetails = () => {

        const detailsStr = localStorage.getItem('details');
        if (detailsStr === null) {

            axiosRole.get(APPLICANT_DETAILS_URL).then((response) => {

                if (response.status === 200) {
                    localStorage.setItem('details', JSON.stringify(response.data));
                    setDetails(response.data);

                    return response.data;
                }

            }).catch((error) => console.log(error));

        }
        setDetails(JSON.parse(detailsStr));

        return JSON.parse(detailsStr);
    }
    const axiosPrivate = useAxiosPrivate();
    const axiosRole = useAxiosRole();
    const { auth } = useAuth();


    useEffect(() => {
        localStorage.removeItem('profilePicUrl');
        getDetails();
    }, []);

    const InputField = ({ type, id, onChange, value, readOnly }) => {

        return (
            <input type={type} id={id} value={value} readOnly={readOnly} onChange={onChange} className='w-full py-3 px-3 border-2 rounded-sm text-gray-700 leading-tight mt-2 focus:outline-none'></input>
        );
    }

    const InfoField = ({ value, css }) => {
        return (
            <h2 className={'text-gray-700 text-lg font-normal ' + css}>{value}</h2>
        );
    }

    const InfoHeader = ({ value, css }) => {
        return (
            <h1 className={'text-2xl font-bold text-gray-900 ' + css}>{value}</h1>
        );
    }


    const DetailsForm = () => {




        const ds = JSON.parse(localStorage.getItem('details'));

        const fileInput = useRef();



        const [firstName, setFirstName] = useState(ds?.firstName || '');
        const [lastName, setLastName] = useState(ds?.lastName || '');

        const [birthDate, setBirthDate] = useState(ds?.birth_date || '');
        const [phone, setPhone] = useState(ds?.phone || '');
        const [cellPhone, setCellPhone] = useState(ds?.cell_phone || '');
        const [country, setCountry] = useState(ds?.country || '');
        const [city, setCity] = useState(ds?.city || '');
        const [road, setRoad] = useState(ds?.road || '');
        const [roadNum, setRoadNum] = useState(ds?.road_number || '');
        const [profilePic, setProfilePic] = useState(undefined);

        const [profilePicUrl, setProfilePicUrl] = useState(localStorage.getItem('profilePicUrl') || '');

        const [tk, setTk] = useState(ds?.postal_code || '');

        const [firstNameError, setFirstNameError] = useState(null);
        const [lastNameError, setLastNameError] = useState(null);

        const [birthDateError, setBirthDateError] = useState(null);
        const [cellPhoneError, setCellPhoneError] = useState(null);
        const [countryError, setCountryError] = useState(null);
        const [cityError, setCityError] = useState(null);
        const [roadError, setRoadError] = useState(null);
        const [roadNumError, setRoadNumError] = useState(null);
        const [tkError, setTkError] = useState(null);


        const handleFileSelect = (e) => {
            const blob = new Blob([e.target.files[0]]);
            const url = URL.createObjectURL(blob);

            //const url = URL.createObjectURL(e.target.files[0]);
            setProfilePicUrl(url);
            setProfilePic(e.target.files[0]);
            //console.log(profilePic);
            localStorage.setItem('profilePic', e.target.files[0]);
            localStorage.setItem('profilePicUrl', url);
            localStorage.setItem('profilePicName', e.target.files[0].name);


        }


        const sendDetails = () => {

            const data = {
                'firstName': firstName,
                'lastName': lastName,
                'birth_date': birthDate,
                'phone': phone,
                'cell_phone': cellPhone,
                'country': country,
                'city': city,
                'road': road,
                'road_number': roadNum,
                'postal_code': tk,
                'profile_pic': profilePic,
            }


            console.log('To be sent: ');
            console.log(data);

            //convert data to form data and send request with Content-Type:multipart/form-data headers
            let form_data = new FormData();
            for (const [key, value] of Object.entries(data)) {

                if (key === 'profile_pic' && value) {

                    form_data.append('profile_pic', value, value.name);
                    continue;
                }

                if (value) form_data.append(key, value);
            }
            axiosRole.post(APPLICANT_DETAILS_URL, form_data, { headers: { 'Content-Type': 'multipart/form-data' } })
                .then((response) => {
                    if (response.status === 200) {
                        localStorage.setItem('details', JSON.stringify(data));
                        setDetails(data);
                        setEditDetails(false);
                    }
                });
        }

        const validateForm = () => {

            const fe = WordOnlyValidator(firstName);
            const le = WordOnlyValidator(lastName);
            const be = RequiredFieldValidator(birthDate);
            const ce = RequiredFieldValidator(cellPhone);
            const coe = TextOnlyValidator(country);
            const cie = TextOnlyValidator(city);
            const re = TextOnlyValidator(road);
            const rne = RequiredFieldValidator(roadNum);
            const te = RequiredFieldValidator(tk);

            setFirstNameError(fe);
            setLastNameError(le);
            setBirthDateError(be);
            setCellPhoneError(ce);
            setCountryError(coe);
            setCityError(cie);
            setRoadError(re);
            setRoadNumError(rne);
            setTkError(te);

            if (fe || le || be || ce || coe
                || cie || re || rne || te) return false;

            return true;
        }


        const handleFormSubmit = (event) => {
            event.preventDefault();

            if (validateForm())
                sendDetails(event);
        }

        function handleAvatarClick(event) {
            fileInput.current.click();

        }

        return (
            <form noValidate={true} onSubmit={handleFormSubmit} className='flex flex-col md:w-[60%] w-[90%]'>
                <div className='flex items-center mt-6 mb-10'>
                    <div className='w-32 h-32 shadow-lg shadow-stone-400 rounded-full mr-4 cursor-pointer' onClick={handleAvatarClick}>
                        <ProfileAvatar picUrl={profilePicUrl} />
                    </div>
                    <input type='file' accept='image/*' id='profilePic' ref={fileInput} onChange={handleFileSelect} className='hidden file:bg-gray-700 file:p-2 file:text-white file:rounded-md file:border-none file:cursor-pointer file:drop-shadow-md file:shadow-stone-400 file:mr-4 file:transition file:duration:500 file:ease-in-out hover:file:-translate-y-2 py-2 pl-4 rounded-sm text-gray-700' />
                </div>

                <div className='flex'>

                    <div className='flex flex-col items-start pr-6 w-full'>
                        <h2>{firstNameText}</h2>
                        <InputField type='text' value={firstName} id='firstName' onChange={(event) => setFirstName(event.target.value)} />
                        <h2 className='text-red-500 text-sm font-bold'>{firstNameError ? firstNameError : ''}</h2>


                    </div>
                    <div className='flex flex-col items-start w-full'>
                        <h2>{lastNameText}</h2>
                        <InputField type='text' value={lastName} id='lastName' onChange={(event) => setLastName(event.target.value)} />
                        <h2 className='text-red-500 text-sm font-bold'>{lastNameError ? lastNameError : ''}</h2>
                    </div>
                </div>

                <div className='flex flex-col items-start mt-6'>
                    <h2>Email</h2>
                    <div className='w-full' onClick={() => { console.log('click') }} >
                        <InputField type='email' id='email' value={email} readOnly={true} />
                    </div>


                </div>

                <div className='flex flex-col items-start mt-6'>
                    <h2>{dateOfBirthText}</h2>
                    <InputField type='date' id='birthDate' value={birthDate} onChange={(event) => setBirthDate(event.target.value)} />
                    <h2 className='text-red-500 text-sm font-bold'>{birthDateError ? birthDateError : ''}</h2>
                </div>

                <div className='flex mt-6'>
                    <div className='w-full flex flex-col items-start pr-6'>
                        <h2>{phoneText}</h2>
                        <InputField type='number' id='phone' value={phone} onChange={(event) => setPhone(event.target.value)} />

                    </div>

                    <div className='w-full flex flex-col items-start'>
                        <h2>{cellPhoneText}</h2>
                        <InputField type='number' id='cellPhone' value={cellPhone} onChange={(event) => setCellPhone(event.target.value)} />
                        <h2 className='text-red-500 text-sm font-bold'>{cellPhoneError ? cellPhoneError : ''}</h2>
                    </div>

                </div>

                <div className='flex'>
                    <div className='flex flex-col justify-start items-start mt-6 pr-6 w-full'>
                        <h2>{countryText}</h2>
                        <InputField type='text' id='country' value={country} onChange={(event) => setCountry(event.target.value)} />
                        <h2 className='text-red-500 text-sm font-bold'>{countryError ? countryError : ''}</h2>
                    </div>

                    <div className='flex flex-col items-start mt-6 w-full'>
                        <h2>{cityText}</h2>
                        <InputField type='text' id='city' value={city} onChange={(event) => setCity(event.target.value)} />
                        <h2 className='text-red-500 text-sm font-bold'>{cityError ? cityError : ''}</h2>
                    </div>
                </div>
                <div className='flex flex-col items-start mt-3'>

                    <div className='flex items-center w-full'>
                        <div className='flex flex-col items-start pr-4 w-full justify-start'>
                            <h2>{roadNameText}</h2>
                            <InputField type='text' id='roadName' value={road} onChange={(event) => setRoad(event.target.value)} />
                            <h2 className='text-red-500 text-sm font-bold'>{roadError ? roadError : ''}</h2>
                        </div>
                        <div className='flex flex-col items-start pr-4 w-full'>
                            <h2>{roadNumberText}</h2>
                            <InputField type='number' id='roadNumber' value={roadNum} onChange={(event) => setRoadNum(event.target.value)} />
                            <h2 className='text-red-500 text-sm font-bold'>{roadNumError ? roadNumError : ''}</h2>
                        </div>
                        <div className='flex flex-col items-start w-full'>
                            <h2>{tkText}</h2>
                            <InputField type='number' id='tk' value={tk} onChange={(event) => setTk(event.target.value)} />
                            <h2 className='text-red-500 text-sm font-bold'>{tkError ? tkError : ''}</h2>
                        </div>
                    </div>

                </div>
                <button type="submit" className="text-white mx-auto w-[50%] p-3 mt-8 bg-gray-700 duration:700 hover:bg-gray-800 shadow-xl shadow-gray-400 transition-all duration:500 ease-in-out hover:rounded-lg hover:-translate-y-2">{detailsSubmitText}</button>
            </form>
        );
    }

    const DetailSheet = ({ data }) => {

        const [profilePicUrl, setProfilePicUrl] = useState(localStorage.getItem('profilePicUrl') || '');
        useEffect(() => {
            if (profilePicUrl === '')
                axiosRole.get(APPLICANT_PROFILEPIC_URL, { responseType: 'blob' }).then((response) => {
                    if (response.status !== 204) {
                        const url = URL.createObjectURL(response.data);
                        setProfilePicUrl(url);
                        localStorage.setItem('profilePicUrl', url);
                    }

                }).catch((error) => { console.log(error) });
        }, []);

        const handleEditDetails = () => {
            setEditDetails(true);
        }
        const residenceText = data.country + ', ' + data.city + ', ' + data.road + ' ' + data.road_number + ', T.K ' + data.postal_code;
        return (
            <div className='w-full h-full'>
                <div className='flex flex-col md:w-[70%] w-[90%] h-full mx-auto drop-shadow-xl'>
                    <div className='flex flex-col w-full h-full mt-12'>
                        <div className='flex w-full h-[15%] min-h-[100px] bg-gradient-to-r from-amber-100 to-amber-200 justify-start items-end rounded-t-3xl' />

                        <div className='flex flex-col items-start pl-6 bg-white rounded-b-2xl pb-6'>
                            <div className='-translate-y-1/2 flex justify-between w-full'>
                                <div className='w-24 h-24 p-1 bg-white shadow-lg shadow-stone-400   sm:w-32 sm:h-32 rounded-full mr-6 '>
                                    <ProfileAvatar picUrl={profilePicUrl} />
                                </div>
                                <div className='pr-6 translate-y-[100%] cursor-pointer' onClick={handleEditDetails}><FaPen fontSize={20} /></div>
                            </div>

                            <div className='flex justify-start items-start'>
                                <InfoHeader value={data.firstName} css='mr-2' />
                                <InfoHeader value={data.lastName} />
                            </div>
                            <InfoField value={residenceText} css='flex justify-start' />
                            <h2 className='flex justify-start mt-12 font-medium text-xl mb-6' >{contactText}</h2>
                            <div className='flex justify-start items-center mb-2'>
                                <FaEnvelope color='' />
                                <InfoField value={auth?.email} css='flex ml-2 justify-start' />
                            </div>
                            <div className='flex justify-start items-center mb-2'>
                                <FaPhone color='' />
                                <InfoField value={data.phone} css='flex ml-2 justify-start' />
                            </div>

                            <div className='flex justify-start items-center mb-12'>
                                <FaMobile color='' />
                                <InfoField value={data.cell_phone} css='flex ml-2 justify-start' />
                            </div>

                            <h2 className='flex justify-start mt-12 font-normal text-xl mb-6' >{uploadedFilesText}</h2>
                        </div>

                    </div>
                </div>

            </div>

        );

    }


    return (

        <div className='flex bg-gray-200 w-full h-full justify-center overflow-y-scroll'>
            {!details ? <DetailsForm /> : editDetails ? <DetailsForm /> : <DetailSheet data={details} />}
        </div>

    );


}

export default UserDetailsFragment;