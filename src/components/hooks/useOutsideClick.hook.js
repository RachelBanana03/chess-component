import { useCallback, useEffect } from "react";

const MOUSE_DOWN = 'mousedown';

function useOutsideClick(handleClose, ref) {
    const handleClick = useCallback((event) => {
        if (ref?.current?.contains && !ref.current.contains(event.target)) {
            handleClose();
        }
    }, [handleClose, ref]);

    useEffect(() => {
        document.addEventListener(MOUSE_DOWN, handleClick);

        return () => { document.removeEventListener(MOUSE_DOWN, handleClick); };
    }, [handleClick]);
}

export default useOutsideClick;