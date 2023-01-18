import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom"
import useAxiosRole from "../hooks/useAxiosRole";

import VerifyEmailPage from "../screens/VerifyEmailPage";

//todo check loading state
const RequireVerify = () => {

    const axiosRole = useAxiosRole();
    const [verified, setVerified] = useState(false);
    useEffect(() => {
        axiosRole.get('/applicants/verified/').then((response) => {
            setVerified(true);
        }).catch(error => console.warn(error));
    }, []);

    return (
        verified
            ? <Outlet />
            : <VerifyEmailPage />
    );
}


export default RequireVerify;