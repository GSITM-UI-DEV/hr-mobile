import * as RadioGroup from "@radix-ui/react-radio-group";
import { useState } from "react";
import "./UIRadioChips.scss";

type ChipsItem = {
    label: string;
    value: string;
    disabled?: boolean;
};

type UIRadioChipsProps = {
    label?: string;
    name: string;
    value?: string;
    items?: ChipsItem[];
    disabled?: boolean;
};

export const UIRadioChips = ({ items = [], disabled = false, name }: UIRadioChipsProps) => {
    const [selectedValue, setSelectedValue] = useState<string | null>(null);

    return (
        <RadioGroup.Root value={selectedValue} onValueChange={setSelectedValue}>
            <div className={`RadioChipsGroup`}>
                {items.map((item) => {
                    const isChecked = selectedValue === item.value;

                    return (
                        <div className={`radio__chips__box outline-none ${disabled ? "is-disabled" : ""}`} key={item.value}>
                            <RadioGroup.Item id={name + "-" + item.value} value={item.value} disabled={item.disabled || disabled} className="radio__chips">
                                <span className={`radio__chips__indicator icon is-check ${isChecked ? "is-active" : ""} ${item.disabled ? "is-disabled" : ""}`}></span>
                                <label className="radio__chips__label fs-15" htmlFor={name + "-" + item.value}>
                                    {item.label}
                                </label>
                            </RadioGroup.Item>
                        </div>
                    );
                })}
            </div>
        </RadioGroup.Root>
    );
};
