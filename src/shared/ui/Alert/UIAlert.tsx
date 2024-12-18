import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { ReactNode } from "react";
import "./UIAlert.scss";
import { UIButton } from "../Button/UIButton";

type AlertDialogProps = {
    triggerProps?: React.ComponentProps<typeof AlertDialog.Trigger>;
    contentProps?: React.ComponentProps<typeof AlertDialog.Content>;
    titleProps?: React.ComponentProps<typeof AlertDialog.Title>;
    descriptionProps?: React.ComponentProps<typeof AlertDialog.Description>;
    cancelProps?: React.ComponentProps<typeof AlertDialog.Cancel>;
    actionProps?: React.ComponentProps<typeof AlertDialog.Action>;
    children: ReactNode; // Trigger 내용 (버튼 등)
    title?: ReactNode; // Title 내용
    description: ReactNode; // Description 내용
    buttons?: "confirm" | "cancel" | "confirm-cancel";
};

export const UIAlert = ({ triggerProps, contentProps, titleProps, descriptionProps, cancelProps, actionProps, children, title, description, buttons = "confirm-cancel" }: AlertDialogProps) => {
    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild {...triggerProps}>
                {children}
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
                <AlertDialog.Overlay className="alert__overlay" />
                <AlertDialog.Content className="alert__content" {...contentProps}>
                    <AlertDialog.Title className="alert__title fs-18 fw-500 mb-1" {...titleProps}>
                        {title}
                    </AlertDialog.Title>

                    {description && (
                        <div className="alert__description__box">
                            <AlertDialog.Description className="alert__description fs-14" {...descriptionProps}>
                                {description}
                            </AlertDialog.Description>
                        </div>
                    )}

                    <div className="alert__buttons">
                        {(buttons == "cancel" || buttons == "confirm-cancel") && (
                            <AlertDialog.Cancel asChild {...cancelProps}>
                                <UIButton className="custom-cancel" type="border">취소</UIButton>
                            </AlertDialog.Cancel>
                        )}
                        {(buttons == "confirm" || buttons == "confirm-cancel") && (
                            <AlertDialog.Action asChild {...actionProps}>
                                <UIButton className="custom-action" type="primary">확인</UIButton>
                            </AlertDialog.Action>
                        )}
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};
