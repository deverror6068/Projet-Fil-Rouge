import {useNavigate} from "react-router-dom";

const useNavigateHook = () => {

    const navigate = useNavigate();

    const home =  () => {

        navigate("/dashboard");

    };

    return home;
}

export default useNavigateHook;
