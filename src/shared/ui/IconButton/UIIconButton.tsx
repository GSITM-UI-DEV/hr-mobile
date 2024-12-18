import { Button } from "@radix-ui/themes";
import React, { ReactNode, useState } from "react";
import "./UIIconButton.scss";

type IconButtonProps = {
    disabled?: boolean;
    className?: string;
    children?: ReactNode;
    onClick?: () => void;
};

export const UIIconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ disabled = false, onClick, className, children }, ref) => {
    const [isActive, setIsActive] = useState(false);

    const handleMouseDown = () => setIsActive(true);
    const handleMouseUp = () => setIsActive(false);

    const hasPressedAction = className?.includes("has-pressed-action");
    const alignRight = className?.includes("align-right");

    return (
        <Button
            ref={ref}
            className={`iconButton ${disabled ? "is-disabled" : ""} ${alignRight ? "flex-direction-row-reverse" : ""} ${hasPressedAction ? "has-pressed-action" : ""}`}
            disabled={disabled}
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div className="iconButton__icon__box ">
                <div className={`iconButton__icon icon ${isActive ? "is-active" : ""} ${className ?? ""}  ${disabled ? "is-disabled" : ""}`}></div>
            </div>
            {children}
        </Button>
    );
});
