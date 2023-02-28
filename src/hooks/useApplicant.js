import { useContext } from "react"
import ApplicantViewContext from "../context/ApplicantViewProvider"

const useApplicant = () => {
    return useContext(ApplicantViewContext);
}

export default useApplicant;