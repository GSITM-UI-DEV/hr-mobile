import * as Label from "@radix-ui/react-label";
import { Select, Theme } from "@radix-ui/themes";
import { useState } from "react";
import "./UISelect.scss";

type SelectItem = {
    label: string;
    error: boolean;
    query?: any;
};

type UISelectProps = {
    items?: SelectItem[]; // label과 error 속성을 가진 객체 배열
    onItemSelect?: (value: string) => void;
    onQuerySelect?: (value: string) => void;
    placeholder?: string | undefined | null;
    label?: string;
    hint?: string;
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    defaultValue?: string;
};

export const UISelect = ({
    items = [],
    onItemSelect = () => {},
    onQuerySelect = () => {},
    placeholder = "선택해주세요",
    label,
    hint,
    error = false,
    disabled = false,
    readOnly = false,
    defaultValue = "",
}: UISelectProps) => {
    const initialSelectedItem = items.find((item) => item.query === defaultValue) || null;
    const [selectedItem, setSelectedItem] = useState<SelectItem | null>(initialSelectedItem); // 초기값 설정

    const isError = selectedItem?.error || error;

    const handleSelect = (value: string) => {
        const selected = items.find((item) => item.label === value) || null;
        if (selected) {
            setSelectedItem(selected);
            onItemSelect(selected.label);
            onQuerySelect(selected.query);
        }
    };

    return (
        <Theme>
            <div className="select__box">
                {label && <Label.Root className="select__label">{label}</Label.Root>}
                <Select.Root
                    value={selectedItem?.label} // 선택된 값 설정
                    disabled={disabled || readOnly}
                    onValueChange={handleSelect}
                >
                    <Select.Trigger
                        placeholder={placeholder!}
                        className={`
                        select__trigger ${isError ? "is-error" : ""}
                        ${disabled ? "is-disabled" : ""}  
                        ${readOnly ? "is-readOnly" : ""}
                    `}
                    />
                    <Select.Content className="select__content">
                        {items.map((item, index) => (
                            <Select.Item
                                key={index}
                                value={item.label}
                                className="select__item"
                            >
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                {(isError || hint) && (
                    <div className={`hint__box ${isError ? "is-error" : "is-origin"}`}>
                        <div className={`icon is-system ${error ? "is-danger" : "is-info"}`}></div>
                        <p>{isError ? (hint ? hint : "에러!") : hint}</p>
                    </div>
                )}
            </div>
        </Theme>
    );
};
