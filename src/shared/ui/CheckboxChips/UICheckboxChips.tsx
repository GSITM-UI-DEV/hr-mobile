import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";
import "./UICheckboxChips.scss";

type ChipsItem = {
    label: string;
    value: string;
    disabled?: boolean;
};

type UICheckboxChipsProps = {
    name: string;
    label?: string;
    value?: string;
    items?: ChipsItem[];
    disabled?: boolean;
};

export const UICheckboxChips = ({ name, items = [], disabled = false }: UICheckboxChipsProps) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const handleChange = (itemValue: string) => {
        if (selectedValues.includes(itemValue)) {
            // 이미 선택된 항목이면 제거
            setSelectedValues(selectedValues.filter((value) => value !== itemValue));
        } else {
            // 새로운 항목 추가
            setSelectedValues([...selectedValues, itemValue]);
        }
    };

    return (
        <div className={`checkboxChipsGroup`}>
            {items.map((item) => {
                const isChecked = selectedValues.includes(item.value);

                return (
                    <div className={`checkbox__chips__box outline-none ${disabled ? "is-disabled" : ""}`} key={item.value}>
                        <Checkbox.Root id={name + "-" + item.value} disabled={item.disabled} className="checkbox__chips" checked={isChecked} onCheckedChange={() => handleChange(item.value)}>
                            <span className={`checkbox__chips__indicator icon is-check ${isChecked ? "is-active" : ""} ${item.disabled ? "is-disabled" : ""}`}></span>
                            <label className="checkbox__chips__label fs-15" htmlFor={name + "-" + item.value}>
                                {item.label}
                            </label>
                        </Checkbox.Root>
                    </div>
                );
            })}
        </div>
    );
};
