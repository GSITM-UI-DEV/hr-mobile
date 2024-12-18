import * as Toast from "@radix-ui/react-toast";
import "./UIToast.scss";

type ToastProps = {
    message: string | null;
    type: string | null; // "success" | "danger" | "none"
    open: boolean;
    onOpenChange: (state: any) => void;
};

export const UIToast = ({ message, type = "none", open, onOpenChange }: ToastProps) => {
    return (
        <Toast.Provider swipeDirection="right" duration={1000}>
            <Toast.Root className="toast__root border-rounded" open={open} onOpenChange={onOpenChange} duration={1000}>
                <Toast.Title className="toast__title fs-15">
                    {type && <span className={`toast__icon icon is-system is-${type}`}></span>}
                    <span className="toast__text">{message}</span>
                </Toast.Title>
            </Toast.Root>
            <Toast.Viewport className="ToastViewport" />
        </Toast.Provider>
    );
};
