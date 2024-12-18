import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { useState, useRef, useEffect } from "react";
import "./UIToggleButton.scss";

type ToggleButtonProps = {
    group: string[];
    disabled?: boolean;
};

export const UIToggleButton = ({ group, disabled = false }: ToggleButtonProps) => {
    const [activeWidth, setActiveWidth] = useState(0); // 활성화된 버튼의 너비 상태 관리
    const [activePosition, setActivePosition] = useState(0); // 활성화된 버튼의 위치 상태 관리
    const containerRef = useRef<HTMLDivElement>(null); // 전체 컨테이너 참조

    const handleValueChange = (value: string) => {
        const activeButton = containerRef.current?.querySelector(`[data-state="on"]`);
        if (activeButton) {
            const { width, left } = activeButton.getBoundingClientRect();
            const containerLeft = containerRef.current?.getBoundingClientRect().left || 0;
            setActiveWidth(width); // 활성화된 버튼의 너비 설정
            setActivePosition(left - containerLeft); // 활성화된 버튼의 위치 설정
        }
    };

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 첫 번째 버튼의 위치와 너비 설정
        handleValueChange(group[0]);
    }, [group]);

    return (
        <ToggleGroup.Root ref={containerRef} className={`toggle_button__box ${disabled ? "is-disabled" : ""}`} type="single" defaultValue={group[0]} onValueChange={handleValueChange} aria-label="Text alignment">
            {/* 선택된 버튼의 배경 원 */}
            <div
                className="switch__active border-rounded"
                style={{
                    width: `${activeWidth}px`,
                    transform: `translateX(${activePosition}px)`,
                }}
            ></div>
            {group.map((item, index) => (
                <ToggleGroup.Item key={index} className="toggle_button__item" value={item} aria-label={`${item} aligned`} disabled={disabled}>
                    {item}
                </ToggleGroup.Item>
            ))}
        </ToggleGroup.Root>
    );
};
