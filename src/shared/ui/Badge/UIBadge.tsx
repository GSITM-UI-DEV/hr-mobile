import React, { ReactNode } from "react";
import { Badge } from "@radix-ui/themes";
import "./UIBadge.scss";

type BadgeProps = {
    color?: string;
    shape?: "square" | "round";
    type?: "dot" | "number" | "border" | "normal" | "text";
    status?: "primary" | "danger" | "information" | "warning" | "secondary";
    children?: ReactNode;
};

export const UIBadge = ({ type = "normal", color, status, shape = "round", children }: BadgeProps) => {
    const hasIcon = React.Children.toArray(children).some((child) => React.isValidElement(child) && child.props?.className?.includes("icon"));

    const layered = hasIcon;

    // children에서 아이콘과 텍스트/숫자 구분
    const processedContent: ReactNode[] = [];
    let iconElement: ReactNode = null;

    React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props?.className?.includes("icon")) {
            iconElement = child;
        } else if (typeof child === "string" || typeof child === "number") {
            // 문자열 또는 숫자 처리
            const content = type === "number" && typeof child === "string" && !isNaN(Number(child)) ? (parseInt(child, 10) > 999 ? "999+" : child) : child;
            processedContent.push(content);
        }
    });

    return (
        <>
            {layered ? (
                <div className="badgeLayerd">
                    <div>{iconElement}</div>
                    <Badge className={`badge is-${type} is-${color} is-${status} is-${shape} is-layerd`}>{processedContent.join(" ")}</Badge>
                </div>
            ) : (
                <Badge className={`badge is-${type} is-${color} is-${status} is-${shape}`}>{processedContent}</Badge>
            )}
        </>
    );
};
