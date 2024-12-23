import { useEffect, useState } from "react";
import { TextArea } from "@radix-ui/themes";
import * as Label from "@radix-ui/react-label";
import "./UITextarea.scss";

type TextAreaProps = {
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    label?: string;
    hint?: string;
    placeholder?: string;
    maxLength?: number;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const UITextarea = ({ defaultValue = "", value = "", maxLength = 100, placeholder = "입력해주세요", error = false, disabled = false, readOnly = false, label, hint, onChange }: TextAreaProps) => {
    const [textareaValue, setTextareaValue] = useState<string | number>(defaultValue || value || "");
    const [charCount, setCharCount] = useState(0);

    // 부모 컴포넌트의 value가 변경될 때 inputValue 업데이트
    useEffect(() => {
        if (value !== undefined) {
            setTextareaValue(value)
        }
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCharCount(e.target.value.length);
        setTextareaValue(e.target.value)
        onChange && onChange(e);
    };

    return (
        <div className="textarea__box flex-direction-column ">
            {/* Label 출력 */}
            {label && <Label.Root className="textarea__label label">{label}</Label.Root>}

            {/* TextArea 컴포넌트 */}
            <TextArea
                className={`textarea outline-none 
                    ${error ? "is-error" : ""} 
                    ${disabled ? "is-disabled" : ""} 
                    ${readOnly ? "is-readOnly" : ""}`}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                onChange={handleTextChange}
                maxLength={maxLength}
            />
            <div className="textarea__bottom__text">
                {/* textarea 글자 수 */}
                {/* disable, readOnly에서는 안보이게 */}
                {!disabled && !readOnly && (
                    <div className="textarea__length__box">
                        <span className={`textarea__length ${maxLength <= charCount || error ? "is-full" : ""}`}>{charCount}</span>/{maxLength}
                    </div>
                )}

                {/* Hint 또는 에러 메시지 출력 */}
                {hint && (
                    <div className={`hint__box ${error ? "is-error" : "is-origin"}`}>
                        <div className={`icon is-system ${error ? "is-danger" : "is-info"}`}></div>
                        <p>{hint}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
