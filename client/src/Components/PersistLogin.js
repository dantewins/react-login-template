import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useRefreshToken from '../Hooks/useRefreshToken';
import useAuth from '../Hooks/useAuth';

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const effectRan = useRef(false);
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        let isMounted = true;

        if (effectRan.current === true) {
            const verifyRefreshToken = async () => {
                try {
                    await refresh();
                }
                catch (err) { }
                finally {
                    isMounted && setIsLoading(false);
                }
            }

            !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
        }

        return () => {
            isMounted = false;
            effectRan.current = true;
        };

        // eslint-disable-next-line
    }, []);

    return (
        <>
            {isLoading
                ? ""
                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;