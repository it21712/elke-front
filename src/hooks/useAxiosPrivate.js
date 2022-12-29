import { axiosPrivate } from "../backend/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";
import { unauthorizedRoute, verifyEmailRoute } from "../routes";
import { unverifiedMessage } from "../strings";
import VerifyEmailPage from "../screens/VerifyEmailPage";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(


            config => {

                if (!config.headers['Authorization']) {

                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;

                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {

                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return axiosPrivate(prevRequest);


                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh])
    return axiosPrivate;
}

export const useAxiosRole = () => {
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(


            config => {

                if (!config.headers['Authorization']) {

                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;

                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401) {
                    navigate(unauthorizedRoute);
                } else if (error.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

                    return axiosPrivate(prevRequest);
                } else if (error?.response?.status === 403 && error?.response?.data['detail'] === unverifiedMessage) {
                    navigate(verifyEmailRoute);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh])
    return axiosPrivate;
}

// export const useAxiosRole = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const responseIntercept = axiosPrivate.interceptors.response.use(
//             response => response,
//             async (error) => {

//                 if (error?.response?.status === 401) {
//                     navigate(unauthorizedRoute);
//                 }

//                 return Promise.reject(error);
//             }
//         );

//         return () => {
//             axiosPrivate.interceptors.response.eject(responseIntercept);
//         }
//     }, []);
//     return axiosPrivate;
// }

export default useAxiosPrivate;