import * as Checkbox from "@radix-ui/react-checkbox";
import { useState } from "react";
import "./UICheckbox.scss";

type CheckboxItem = {
    label?: string;
    value: string;
    disabled?: boolean;
};

type UICheckboxProps = {
    label?: string;
    value?: string;
    group?: boolean;
    checked?: boolean;
    items?: CheckboxItem[]; // 그룹일 때 사용하는 아이템 배열
    mode?: "single" | "multi"; // 선택 모드
    disabled?: boolean;
    direction?: string;
    onChange?: (e: any) => void;
    onChecked?: (e: any) => void;
};


export const UICheckbox = ({ label, value, disabled, checked, onChecked = () => {} }: UICheckboxProps) => {
    const [isChecked, setIsChecked] = useState(checked);
  
    const handleChange = (checked: boolean) => {
      setIsChecked(checked);
      onChecked(checked); // 부모 컴포넌트에 체크 상태 전달
    };
  
    return (
      <div className="checkbox__box outline-none">
        <Checkbox.Root
          id={value || ""}
          checked={isChecked}
          onCheckedChange={handleChange}
          className="checkbox__root icon is-check is-disabled p-0"
          disabled={disabled}
        >
          <Checkbox.Indicator className={`checkbox__indicator icon is-check ${isChecked ? "is-inverse" : ""} ${disabled ? "is-disabled" : ""}`}></Checkbox.Indicator>
        </Checkbox.Root>
        {label && <label className="checkbox__label" htmlFor={value || ""}>{label}</label>}
      </div>
    );
  };





// export const UICheckbox = ({ label, value, direction = "row", group = false, items = [], mode = "multi", disabled = false, onChecked = () => {} }: UICheckboxProps) => {
//     const [selectedValues, setSelectedValues] = useState<string[]>([]);

//     // 선택 모드에 따른 체크박스 선택 핸들러
//     const handleChange = (itemValue: string) => {
//         if (mode === "single") {
//             setSelectedValues([itemValue]); // 단일 선택 모드일 때는 선택된 값만 배열에 저장
//             onChecked([itemValue]);
//         } else {
//             if (selectedValues.includes(itemValue)) {
//                 setSelectedValues((prev) => prev.filter((val) => val !== itemValue)); // 이미 선택된 값이면 배열에서 제거
//                 onChecked(itemValue);
//             } else {
//                 setSelectedValues((prev) => [...prev, itemValue]); // 그렇지 않으면 배열에 추가
//                 onChecked(itemValue);
//             }
//         }
//     };

//     // 그룹일 때
//     if (group) {
//         return (
//             <div className={`checkbox__group ${"flex-direction-" + direction}`}>
//                 {items.map((item) => {
//                     const isChecked = selectedValues.includes(item.value); // 선택 여부 확인

//                     return (
//                         <div className={`checkbox__box outline-none ${item.disabled ? "is-disabled" : ""}`} key={item.value}>
//                             <Checkbox.Root id={item.value} disabled={item.disabled || disabled} className="checkbox__root icon is-check is-disabled p-0" checked={isChecked} onCheckedChange={() => handleChange(item.value)}>
//                                 {/* 체크된 항목에만 is-inverse 클래스 추가 */}
//                                 <Checkbox.Indicator className={`checkbox__indicator icon is-check ${isChecked ? "is-inverse" : ""} ${item.disabled ? "is-disabled" : ""}`}></Checkbox.Indicator>
//                             </Checkbox.Root>
//                             <label className="checkbox__label" htmlFor={item.value}>
//                                 {item.label}
//                             </label>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     }

//     // 그룹이 아닐 때
//     const isChecked = selectedValues.includes(value || ""); // 선택 여부 확인

//     return (
//         <div className={`checkbox__box outline-none ${disabled ? "is-disabled" : ""}`}>
//             <Checkbox.Root id={value} disabled={disabled} className="checkbox__root icon is-check is-disabled p-0" checked={isChecked} onCheckedChange={() => handleChange(value || "")}>
//                 {/* 체크된 항목에만 is-inverse 클래스 추가 */}
//                 <Checkbox.Indicator className={`checkbox__indicator icon is-check ${isChecked ? "is-inverse" : ""} ${disabled ? "is-disabled" : ""}`}></Checkbox.Indicator>
//             </Checkbox.Root>
//             {label && (
//                 <label className="checkbox__label" htmlFor={value}>
//                     {label}
//                 </label>
//             )}
//         </div>
//     );
// };
