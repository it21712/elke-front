import { createContext, useState } from "react";

const ApplicantViewContext = createContext({});

export const ApplicantViewProvider = ({ children }) => {

    const [applicant, setApplicant] = useState();

    return (
        <ApplicantViewContext.Provider value={{ applicant, setApplicant }}>
            {children}
        </ApplicantViewContext.Provider>
    );

}

export default ApplicantViewContext;