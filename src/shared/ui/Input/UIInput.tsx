/* eslint-disable @typescript-eslint/no-unused-expressions */
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import "./UIInput.scss";

type TextFieldProps = {
    defaultValue?: string | number;
    value?: string | number;
    type?: "date" | "datetime-local" | "email" | "hidden" | "month" | "number" | "password" | "search" | "tel" | "text" | "time" | "url" | "week";
    placeholder?: any;
    disabled?: boolean;
    readOnly?: boolean;
    rightaligned?: boolean;
    label?: string;
    hint?: string;
    is_search?: boolean;
    error?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UIInput = ({ defaultValue = "", type = "text", is_search = false, error = false, disabled = false, readOnly = false, rightaligned = false, label, hint, placeholder, value, onChange }: TextFieldProps) => {
    // inputValue 상태 추가 (초기값을 defaultValue 또는 value로 설정)
    const [inputValue, setInputValue] = useState<string | number>(defaultValue || value || "");
    
    // 부모 컴포넌트의 value가 변경될 때 inputValue 업데이트
    useEffect(() => {
        if (value !== undefined) {
            setInputValue(value)
        }
    }, [value]);

    // 입력 값 변경 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange && onChange(e);
    };

    // x 버튼 클릭 핸들러 (입력 값 초기화)
    const clearInput = () => {
        setInputValue("");
        onChange && onChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    };

    const getPlaceholder = placeholder ? placeholder : is_search ? "검색어를 입력해주세요" : "내용을 입력해주세요";

    return (
        <div className="input__box ">
            {/* label */}
            {label && <label className="input__label label">{label}</label>}

            <div
                className={`input__wrapper overflow-hidden d-flex align-items-center outline-none
                    ${error ? "is-error" : ""}
                    ${disabled ? "is-disabled" : ""}
                    ${readOnly ? "is-readOnly" : ""}
                `}
            >
                {/* 돋보기 아이콘 */}
                {is_search && <MagnifyingGlassIcon className="icon__search" />}

                {/* input */}
                <input type={type} spellCheck="false" placeholder={getPlaceholder} className={`input ${rightaligned ? "is-rightaligned" : ""}`} disabled={disabled} readOnly={readOnly} value={inputValue} onChange={handleInputChange} />

                {/* 입력값이 있고 readOnly가 아닐 때만 x 버튼 표시 */}
                {inputValue && !readOnly && (
                    <>
                        <div className="clear__bar"></div>
                        <button onClick={clearInput} className="clear__button icon is-delete"></button>
                    </>
                )}
            </div>

            {/* hint */}
            {hint && (
                <div className={`hint__box ${error ? "is-error" : "is-origin"}`}>
                    <div className={`icon is-system ${error ? "is-danger" : "is-info"}`}></div>
                    <p>{hint}</p>
                </div>
            )}
        </div>
    );
};
