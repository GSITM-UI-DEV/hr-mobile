import * as Switch from "@radix-ui/react-switch";
import "./UISwitchButton.scss";

type SwitchButtonProps = {
    label?: string;
    disabled?: boolean;
};

export const UISwitchButton = ({ label, disabled }: SwitchButtonProps) => {
    return (
        <div className="switch__box ">
            <Switch.Root className={`switch__root border-none ${disabled ? "is-disabled" : ""}`} disabled={disabled}>
                <Switch.Thumb className="switch__thumb" />
            </Switch.Root>

            {label && <label className="switch__label ml-10">{label}</label>}
        </div>
    );
};
