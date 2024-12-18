import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";
import "./UIChips.scss";

type ChipsItem = {
    label: string;
    value: string;
    disabled?: boolean;
};

type UIChipsProps = {
    label?: string;
    value?: string;
    items?: ChipsItem[];
    mode?: "single" | "multi";
    disabled?: boolean;
};

export const UIChips = ({ items = [], mode = "multi", disabled = false }: UIChipsProps) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleChange = (itemValue: string) => {
        if (mode === "single") {
            // Single 모드: 한 개의 아이템만 선택 가능
            setSelectedValues([itemValue]);
        } else {
            // Multi 모드: 다중 선택 가능
            if (selectedValues.includes(itemValue)) {
                // 이미 선택된 항목이면 제거
                setSelectedValues(selectedValues.filter((value) => value !== itemValue));
            } else {
                // 새로운 항목 추가
                setSelectedValues([...selectedValues, itemValue]);
            }
        }
    };

    return (
        <div className={`chips__group flex-direction-row`}>
            {items.map((item) => {
                const isChecked = selectedValues.includes(item.value); // 선택 여부 확인

                return (
                    <div className={`chips__box outline-none ${disabled ? "is-disabled" : ""}`} key={item.value}>
                        <Checkbox.Root id={item.value} disabled={item.disabled || disabled} className="chips__root" checked={isChecked} onCheckedChange={() => handleChange(item.value)}>
                            <span className={`chips__indicator icon is-check ${isChecked ? "is-active" : ""} ${item.disabled ? "is-disable" : ""}`}></span>
                            <label className="chips__label fs-15" htmlFor={item.value}>
                                {item.label}
                            </label>
                        </Checkbox.Root>
                    </div>
                );
            })}
        </div>
    );
};
