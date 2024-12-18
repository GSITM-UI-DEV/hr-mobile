import * as RadioGroup from "@radix-ui/react-radio-group";
import "./UIRadio.scss";

type RadioItem = {
    label?: string;
    value: string;
    disabled?: boolean;
};
type UIRadioProps = {
    name?: string;
    direction?: string;
    items?: RadioItem[];
    onItemSelect: (value: string) => void;
};

export const UIRadio = ({ onItemSelect, name, items = [], direction = "row" }: UIRadioProps) => {
    return (
        <RadioGroup.Root className={`radio__root  ${"flex-direction-" + direction}`}>
            {items.map((item) => (
                <div className={`radio__box ${item.disabled ? "is-disabled" : ""}`} key={item.value}>
                    <RadioGroup.Item id={name + "-" + item.value} className={`radio__item `} key={item.value} onSelect={() => onItemSelect(item.value)} value={item.value} disabled={item.disabled}></RadioGroup.Item>
                    <label htmlFor={name + "-" + item.value} className="radio__label fs-15 ml-5">
                        {item.label}
                    </label>
                </div>
            ))}
        </RadioGroup.Root>
    );
};
