import { Button } from "@radix-ui/themes";
import React, { ReactNode } from "react";
import "./UIButton.scss";

type ButtonProps = {
    type?: "primary" | "secondary" | "border" | "text";
    size?: string;
    disabled?: boolean;
    shape?: string;
    className?: string;
    children: ReactNode;
    onClick?: () => void;
};

// React.forwardRef를 사용하여 ref를 처리할 수 있도록 수정
export const UIButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ shape = "rounded", type = "text", disabled = false, size, onClick, className, children }, ref) => {
    return (
        <Button ref={ref} className={`button is-${type} ${shape} is-${size ?? ""}  ${disabled ? "is-disabled" : ""} ${className ?? ""}`} disabled={disabled} onClick={onClick}>
            {children}
        </Button>
    );
});

// 컴포넌트 이름 설정 (디버깅용)
UIButton.displayName = "UIButton";
