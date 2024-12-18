import * as Label from "@radix-ui/react-label";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import React, { useState, useEffect } from "react";
import { CaptionLabelProps, DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { ko } from "react-day-picker/locale";
import "./UIDatePicker.scss";

type UIDatePickerProps = {
    placeholder?: string;
    label?: string;
    type?: "date" | "range" | "month" | "year-month";
    error?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    hint?: string;
    date?: string;
    onDateSelect?: (e: any) => void;
    onDateRangeChange?: (e: any) => void;
    onMonthSelect?: (month: Date) => void;
};

// 일요일 color red로 하기 위한 함수
const isSunday = (date: Date) => date.getDay() === 0;

const CustomCaptionLabel = (props: CaptionLabelProps): React.ReactElement => {
    const nowdate = props.children ?? "";
    if (typeof nowdate !== "string") {
        return <span>{`날짜를 선택해주세요`}</span>;
    }

    const year = nowdate.split(" ")[1];
    const month = nowdate.split(" ")[0];

    return <span>{`${year}년 ${month}`}</span>;
};

export const UIDatePicker = ({ placeholder = "날짜를 선택해주세요", label, hint, type = "date", error = false, disabled = false, readOnly = false, onDateSelect, onDateRangeChange, onMonthSelect }: UIDatePickerProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
    const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
    const [isStartOpen, setIsStartOpen] = useState(false);
    const [isEndOpen, setIsEndOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<Date | undefined>();
 
    const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
    const [selectedMonthGrid, setSelectedMonthGrid] = useState<number | undefined>(undefined);

    const handleMonthSelect = (month: Date) => {
        setSelectedMonth(month);
        if (onMonthSelect) {
        onMonthSelect(month);
        }
    };

    const applyRangeSelection = () => {
        setSelectedRange(tempRange);
        onDateRangeChange && onDateRangeChange({
            fromDate: tempRange?.from?.toLocaleDateString('sv-SE'),
            toDate: tempRange?.to?.toLocaleDateString('sv-SE'),
        });
        setIsStartOpen(false);
        setIsEndOpen(false);
    };

    const cancelRangeSelection = () => {
        setTempRange(selectedRange);
        onDateRangeChange && onDateRangeChange({
            fromDate: selectedRange?.from?.toLocaleDateString('sv-SE'),
            toDate: selectedRange?.to?.toLocaleDateString('sv-SE'),
        });
        setIsStartOpen(false);
        setIsEndOpen(false);
    };

    // dim 요소의 열림 상태 결정
    const isDimVisible = isStartOpen || isEndOpen;


    useEffect(() => {
        if (selectedYear && selectedMonthGrid !== undefined) {
            const selectedDate = new Date(selectedYear, selectedMonthGrid, 1);
            if (onMonthSelect) {
                onMonthSelect(selectedDate);
            }
        }
    }, [selectedYear, selectedMonthGrid, onMonthSelect]);

    const handlePreviousYear = () => {
        setSelectedYear((prevYear) => (prevYear ? prevYear - 1 : new Date().getFullYear() - 1));
    };
    
    const handleNextYear = () => {
        setSelectedYear((prevYear) => (prevYear ? prevYear + 1 : new Date().getFullYear() + 1));
    };

    return (
        <div className="datepicker__box d-flex flex-direction-column fs-15">
            {label && <Label.Root className="datepicker__label label">{label}</Label.Root>}

            {/* dim 요소를 Popover의 open 상태에 따라 조건부 렌더링 */}
            {isDimVisible && (
                <div
                    className="dim"
                    onClick={() => {
                        setIsStartOpen(false);
                        setIsEndOpen(false);
                    }}
                ></div>
            )}

            {type === "range" ? (
                <div className="datepicker__range__trigger">
                    {/* 시작 날짜 버튼 */}
                    <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                        <PopoverTrigger asChild>
                            <button className={`datepicker__trigger fs-14 d-flex justify-content-between align-items-center ${error ? "is-error" : ""}`} disabled={readOnly || disabled}>
                                {selectedRange?.from ? selectedRange.from.toLocaleDateString('sv-SE') : placeholder}
                                <div className={`datepicker__icon icon is-calender d-block ml-10 ${disabled ? "is-disabled" : ""}`}></div>
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="range datepicker__content d-flex justify-content-end align-items-cneter flex-direction-column ">
                            <DayPicker
                                mode="range"
                                locale={ko}
                                selected={(tempRange as DateRange) || (selectedRange as DateRange)}
                                onSelect={setTempRange}
                                className="datepicker datepicker__range"
                                disabled={disabled}
                                modifiers={{ sunday: isSunday }}
                                modifiersClassNames={{ sunday: "red-sunday" }}
                                components={{ CaptionLabel: CustomCaptionLabel }}
                            />

                            <div className="datepicker__range__button mt-20 pt-20">
                                <button className="range__button is-cancel" onClick={cancelRangeSelection}>
                                    취소
                                </button>
                                <button className="range__button is-confirm" onClick={applyRangeSelection}>
                                    확인
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* 끝 날짜 버튼 */}
                    <Popover open={isEndOpen} onOpenChange={setIsEndOpen}>
                        <PopoverTrigger asChild>
                            <button className={`datepicker__trigger fs-14 d-flex justify-content-between align-items-center ${error ? "is-error" : ""}`} disabled={readOnly || disabled}>
                                {selectedRange?.to ? selectedRange.to.toLocaleDateString('sv-SE') : placeholder}
                                <div className={`datepicker__icon icon is-calender d-block ml-10 ${disabled ? "is-disabled" : ""}`}></div>
                            </button>
                        </PopoverTrigger>

                        <PopoverContent className="datepicker__content d-flex justify-content-end align-items-cneter flex-direction-column ">
                            <DayPicker
                                mode="range"
                                locale={ko}
                                selected={(tempRange as DateRange) || (selectedRange as DateRange)}
                                onSelect={setTempRange}
                                className="datepicker datepicker__range"
                                disabled={disabled}
                                modifiers={{ sunday: isSunday }}
                                modifiersClassNames={{ sunday: "red-sunday" }}
                                components={{ CaptionLabel: CustomCaptionLabel }}
                            />
                            <div className="datepicker__range__button mt-20 pt-20">
                                <button className="range__button is-cancel" onClick={cancelRangeSelection}>
                                    취소
                                </button>
                                <button className="range__button is-confirm" onClick={applyRangeSelection}>
                                    확인
                                </button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            ) : type === "month" ? (
                <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className={`datepicker__trigger fs-14 d-flex justify-content-between align-items-center ${error ? "is-error" : ""}`}
                            disabled={readOnly || disabled}
                        >
                            {selectedMonth
                                ? `${selectedMonth.getFullYear()}-${(selectedMonth.getMonth() + 1).toString().padStart(2, "0")}`
                                : placeholder}
                            <div className={`datepicker__icon icon is-calender d-block ml-10 ${disabled ? "is-disabled" : ""}`}></div>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="datepicker__content d-flex justify-content-end align-items-cneter flex-direction-column">
                        <DayPicker
                            mode="single"
                            locale={ko}
                            selected={selectedMonth}
                            onMonthChange={(month) => handleMonthSelect(month)}
                            fromYear={2000}
                            toYear={2030}
                            className="datepicker__month"
                            showOutsideDays={false}
                            captionLayout="dropdown" // 월/연도 드롭다운
                            components={{
                                CaptionLabel: CustomCaptionLabel,
                            }}
                        />
                    </PopoverContent>
                </Popover>
            ) : type === "year-month" ? (
                <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger asChild>
                        <button
                            className={`datepicker__trigger fs-14 d-flex justify-content-between align-items-center ${error ? "is-error" : ""}`}
                            disabled={readOnly || disabled}
                        >
                            {selectedYear && selectedMonthGrid !== undefined
                                ? `${selectedYear}-${(selectedMonthGrid + 1).toString().padStart(2, "0")}`
                                : placeholder}
                            <div className={`datepicker__icon icon is-calender d-block ml-10 ${disabled ? "is-disabled" : ""}`}></div>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="datepicker__content d-flex justify-content-end align-items-center flex-direction-column">
                        <div className="datepicker__year-month-selector">
                            {/* 년도 선택 영역 */}
                            <div className="datepicker__year-navigation">
                                <button className="year-arrow prev-year" onClick={handlePreviousYear}>
                                    &lt;
                                </button>
                                <span className="current-year">{selectedYear ?? new Date().getFullYear()}</span>
                                <button className="year-arrow next-year" onClick={handleNextYear}>
                                    &gt;
                                </button>
                            </div>

                            {/* 월 선택 영역 */}
                            <div className="datepicker__month-grid">
                            {Array.from({ length: 12 }, (_, i) => (
                                <button
                                    key={i}
                                    className={`datepicker__month-item ${selectedMonthGrid === i ? "is-selected" : ""}`}
                                    onClick={() => {
                                        // 현재 년도를 자동으로 반영
                                        if (!selectedYear) {
                                            setSelectedYear(new Date().getFullYear());
                                        }
                                        setSelectedMonthGrid(i);

                                        // 부모 컴포넌트로 선택된 값 전달
                                        if (onMonthSelect) {
                                            const year = selectedYear ?? new Date().getFullYear();
                                            const selectedDate = new Date(year, i, 1);
                                            onMonthSelect(selectedDate);
                                        }
                                    }}
                                >
                                    {`${i + 1}`}월
                                </button>
                            ))}
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            ) : (
                <Popover open={isStartOpen} onOpenChange={setIsStartOpen}>
                    <PopoverTrigger
                        asChild
                        className={`
                            datepicker__trigger fs-14
                             d-flex justify-content-between align-items-center
                            ${error ? "is-error" : ""} 
                            ${disabled ? "is-disabled" : ""} 
                            ${readOnly ? "is-readOnly" : ""}
                        `}
                        disabled={readOnly || disabled}
                    >
                        <button>
                            {type === "date" && selectedDate ? selectedDate.toLocaleDateString('sv-SE') : placeholder}
                            <div className={`datepicker__icon icon is-calender d-block ml-10 ${disabled ? "is-disabled" : ""}`}></div>
                        </button>
                    </PopoverTrigger>

                    <PopoverContent className="datepicker__content d-flex justify-content-end align-items-cneter flex-direction-column ">
                        <DayPicker
                            mode="single"
                            locale={ko}
                            selected={selectedDate}
                            onSelect={(date) => {
                                setSelectedDate(date);
                                if (onDateSelect) {
                                    onDateSelect(date?.toLocaleDateString('sv-SE').replace(/-/g, ""));
                                }
                            }}
                            className="datepicker datepicker__single radius-t-12 ptb-20"
                            disabled={disabled}
                            modifiers={{ sunday: isSunday }}
                            modifiersClassNames={{ sunday: "red-sunday" }}
                            components={{ CaptionLabel: CustomCaptionLabel }}
                        />
                    </PopoverContent>
                </Popover>
            )}

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
