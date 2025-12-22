import { useEffect } from 'react';

const useTitle = (title) => {
    useEffect(() => {
        document.title = `${title} | eTuitionBd`;
    }, [title]);
};

export default useTitle;
