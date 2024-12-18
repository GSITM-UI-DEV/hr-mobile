import { useState } from "react";
// import { DropdownMenu } from '@radix-ui/themes';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./UIDropdownMenu.scss";

type UIDropdownMenuProps = {
    variant?: "soft";
    items: string[];
    onItemSelect: (value: string) => void;
};

export const UIDropdownMenu = ({
    items,
    onItemSelect,
}: UIDropdownMenuProps) => {
    const [selectedItem, setSelectedItem] = useState<string | null>(null);

    const handleSelect = (item: string) => {
        setSelectedItem(item); // 선택된 값 업데이트
        onItemSelect(item); // 콜백 함수 호출
    };

    return (
        <div className="dropdown__box">
            <DropdownMenu.Root>
                {/* 선택된 값 출력 */}
                <p>선택값 : {selectedItem ? selectedItem : "없음"}</p>

                <DropdownMenu.Trigger className="dropdown__trigger">
                    Dropdown Options
                </DropdownMenu.Trigger>

                <DropdownMenu.Content className="dropdown__content">
                    {items.map((item, index) => (
                        <DropdownMenu.Item
                            key={index}
                            className="dropdown__item"
                            onSelect={() => handleSelect(item)}
                        >
                            {item}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
};
