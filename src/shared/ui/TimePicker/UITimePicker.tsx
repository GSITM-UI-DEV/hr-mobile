import * as Label from "@radix-ui/react-label";
import { useState } from "react";
import "react-day-picker/dist/style.css";
import "./UITimePicker.scss";

type UITimePickerProps = {
    placeholder?: string;
    label?: string;
    type?: "time" | "range";
    error?: boolean;
    hint?: string;
    disabled?: boolean;
    readOnly?: boolean;
    start?: string;
    end?: string;
    minutesFix?: boolean;
    onStartTimeChange?: (e: any) => void;
    onEndTimeChange?: (e: any) => void;
};

// AM/PM 및 시간 형식을 변환하는 함수
const formatTime = (time: string) => {
    if (!time) return "";
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${period} ${formattedHour}:${minute < 10 ? `0${minute}` : minute}`;
};

export const UITimePicker = ({ placeholder = "10:00", hint, label, type = "time", error = false, disabled = false, readOnly = false, start = "", end = "", minutesFix = false, onStartTimeChange, onEndTimeChange }: UITimePickerProps) => {
    // range 시작 시간과 종료 시간을 별도로 관리
    const [startTime, setStartTime] = useState<string>(start);
    const [endTime, setEndTime] = useState<string>(end);


    return (
        <div className="timepicker__box">
            {label && <Label.Root className="timepicker__label">{label}</Label.Root>}

            {type === "time" ? (
                // 단일 시간 선택
                <div className="timepicker__trigger">
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className={`
                            timepicker ${error ? "is-error" : ""} 
                            ${disabled ? "is-disabled" : ""} 
                            ${readOnly ? "is-readOnly" : ""}`}
                        disabled={disabled}
                        readOnly={readOnly}
                    />
                    <div className={`timepicker__icon icon is-time`}></div>
                </div>
            ) : (
                // 시간 범위 선택
                <div className="timepicker__range__trigger">
                    {/* 시작 시간 선택 */}
                    <div className="timepicker__trigger">
                        <input
                            step={1800}
                            type="time"
                            value={startTime}
                            // onChange={(e) => {
                            //     setStartTime(e.target.value)
                            //     if (onStartTimeChange) {
                            //         onStartTimeChange(e.target.value);
                            //     }
                            // }}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (minutesFix) {
                                    const [hours, minutes] = value.split(":").map(Number);
                                    if (minutes % 30 === 0) {
                                    setStartTime(value);
                                    if (onStartTimeChange) onStartTimeChange(value);
                                    } else {
                                    alert("입력값은 30분 단위여야 합니다.\n분단위부터 설정해주세요.");
                                    }
                                } else {
                                    setStartTime(value);
                                    if (onStartTimeChange) {
                                        onStartTimeChange(value);
                                    }
                                }
                            }}
                            className={`
                                timepicker ${error ? "is-error" : ""} 
                                ${disabled ? "is-disabled" : ""} 
                                ${readOnly ? "is-readOnly" : ""}`}
                            disabled={disabled}
                            readOnly={readOnly}
                        />
                        <div className={`timepicker__icon icon is-time`}></div>
                    </div>

                    {/* 종료 시간 선택 */}
                    <div className="timepicker__trigger">
                        <input
                            step={1800}
                            type="time"
                            value={endTime}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (minutesFix) {
                                    const [hours, minutes] = value.split(":").map(Number);
                                    if (minutes % 30 === 0) {
                                    setEndTime(value);
                                    if (onEndTimeChange) onEndTimeChange(value);
                                    } else {
                                    alert("입력값은 30분 단위여야 합니다.\n분단위부터 설정해주세요.");
                                    }
                                } else {
                                    setEndTime(value);
                                    if (onEndTimeChange) {
                                        onEndTimeChange(value);
                                    }
                                }
                            }}
                            className={`
                                timepicker ${error ? "is-error" : ""} 
                                ${disabled ? "is-disabled" : ""} 
                                ${readOnly ? "is-readOnly" : ""}`}
                            disabled={disabled}
                            readOnly={readOnly}
                        />
                        <div className={`timepicker__icon icon is-time`}></div>
                    </div>
                </div>
            )}

            {/* 시간 범위 출력 */}
            {/* {type === "range" && <p className="timepicker__range__output">{`${formatTime(startTime)} ~ ${formatTime(endTime)}`}</p>} */}

            {/* Hint 또는 에러 메시지 출력 */}
            {hint && (
                <div className={`hint__box ${error ? "is-error" : "is-origin"}`}>
                    <div className={`icon is-system ${error ? "is-danger" : "is-info"}`}></div>
                    <p>{hint}</p>
                </div>
            )}
        </div>
    );
};
