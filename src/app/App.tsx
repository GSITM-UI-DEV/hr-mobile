import { UIAlert, UIAvatar, UIBadge, UIButton, UIIconButton, UICheckbox, UICheckboxChips, UIRadioChips, UIDatePicker, UIInput, UIRadio, UISelect, UISwitchButton, UITabs, UITextarea, UITimePicker, UIToast, UIToggleButton } from "@/shared/ui";
import { useState } from "react";
import "./App.scss";

function App() {
    const selectItems = [
        { label: "Item 1", error: false },
        { label: "Item 2", error: false },
        { label: "Item 3", error: true },
        { label: "Item 4", error: true },
    ];

    // const dropdownItems = ["Item 1", "Item 2", "Item 3"];
    const tabsData = [
        { value: "tab1", label: "One", content: <div>11111</div>, disabled: true },
        { value: "tab2", label: "Two", content: <div>22222</div> },
        { value: "tab3", label: "Three", content: <div>33333</div> },
        { value: "tab4", label: "Four", content: <div>44444</div> },
        { value: "tab5", label: "Five", content: <div>55555</div> },
        { value: "tab6", label: "Six", content: <div>66666</div> },
        { value: "tab7", label: "Seven", content: <div>77777</div> },
        { value: "tab8", label: "Eight", content: <div>88888</div> },
        { value: "tab9", label: "Nine", content: <div>99999</div> },
        { value: "tab10", label: "Ten", content: <div>101010</div> },
    ];

    // radio
    const radioItems = [
        { label: "label 1", value: "value1", disabled: true },
        { label: "label 2", value: "value2" },
        { label: "label 3", value: "value3" },
    ];

    // checkbox
    const checkboxItems = [
        { label: "label 1", value: "value1" },
        { label: "label 2", value: "value2" },
        { label: "label 3", value: "value3", disabled: true },
    ];

    // chips
    const chipsItems = [
        { label: "label 1", value: "value1", disabled: true },
        { label: "label 2", value: "value2" },
        { label: "label 3", value: "value3" },
    ];

    // Toast alert
    const [openToast1, setOpenToast1] = useState<boolean>(false);
    const [openToast2, setOpenToast2] = useState<boolean>(false);
    const [openToast3, setOpenToast3] = useState<boolean>(false);

    const handleButtonClick = () => {
        setOpenToast1(true);
    };

    return (
        <div className="wrapper">
            <UIDatePicker label="Year & Month" placeholder="yyyy-mm" type="year-month"/>
            <div className="container">
                <h2>badge</h2>

                <b>dot</b>
                <div className="flex-center gap-10">
                    <UIBadge type="dot" color="green" />
                    <UIBadge type="dot" color="red" />
                </div>

                <hr />

                <b>number</b>
                <div className="flex-center mb-10 gap-10">
                    <UIBadge type="number" color="green">
                        5
                    </UIBadge>
                    <UIBadge type="number" color="red">
                        5
                    </UIBadge>
                </div>

                <div className="flex-center gap-10">
                    <UIBadge type="number" color="green">
                        998
                    </UIBadge>
                    <UIBadge type="number" color="red">
                        1111
                    </UIBadge>
                </div>

                <hr />

                <b>normal</b>
                <div className="flex-center mb-10 gap-10">
                    <UIBadge type="text" color="green">
                        badge
                    </UIBadge>
                    <UIBadge color="green">badge</UIBadge>
                    <UIBadge color="gray">badge</UIBadge>
                    <UIBadge type="border" color="green">
                        badge
                    </UIBadge>
                </div>
                <hr />

                <b>border</b>
                <div className="flex-center mb-10 gap-10">
                    <UIBadge type="border" shape="square" color="green">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" color="red">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" color="blue">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" color="yellow">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" color="gray">
                        badge
                    </UIBadge>
                </div>
                <hr />

                <b>status color</b>
                <div className="flex-center mb-10 gap-10">
                    <UIBadge type="border" shape="square" status="primary">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" status="danger">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" status="information">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" status="warning">
                        badge
                    </UIBadge>
                    <UIBadge type="border" shape="square" status="secondary">
                        badge
                    </UIBadge>
                </div>
                <hr />

                <b>icon layered</b>
                <div className="flex-center mb-10 gap-10">
                    <UIBadge type="dot" color="green">
                        <div className="icon is-32 is-alarm"></div>
                    </UIBadge>
                    <UIBadge type="number" status="danger">
                        <div className="icon is-32 is-alarm"></div>3
                    </UIBadge>
                </div>
            </div>

            <div className="container">
                <h2>Avatar</h2>
                <UIAvatar size="small" icon="setting" fallback="이미지 로드 실패!" />
                <UIAvatar size="medium" icon="setting" src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="이미지 로드 실패!" />
                <UIAvatar size="large" icon="setting" src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop" fallback="이미지 로드 실패!" />
            </div>

            {/* <div className="container">
                <Navigation />
            </div>

            <div className="container">
                쓸까말까..
                <hr />
                <UIText as="label">label</UIText>
                <UIText as="p">p</UIText>
                <UIText as="div">div</UIText>
            </div> 
    
            <div className="container">
                <UIForm />
            </div>

            <div className="container">
                <h2>dropdown</h2>
                <UIDropdownMenu
                    items={dropdownItems}
                    onItemSelect={(value: string) => console.log("Selected:", value)} // 함수 구현
                />
            </div>


            <div className="container">
                <UILink href="https://www.naver.com" truncate weight="bold" color="indigo">
                    naver.com
                </UILink>
            </div> */}

            <div className="container">
                <h2>toggle button</h2>

                <b>2 option</b>
                <UIToggleButton group={["사과", "바나나"]} />

                <b>3 option</b>
                <UIToggleButton group={["사과", "바나나", "포도"]} />

                <hr />

                <b>disabled toggle button</b>
                <UIToggleButton group={["사과", "바나나", "포도"]} disabled />
            </div>

            <div className="container">
                <h2>input</h2>

                <b>default input</b>
                <UIInput />

                <b>placeholder 적용 input</b>
                <UIInput placeholder="placeholder 적용" />

                <b>label 적용 input</b>
                <UIInput label="Placeholder 적용" />

                <b>hint 적용 input</b>
                <UIInput hint="hint" />

                <hr />

                <b>search input</b>
                <UIInput is_search={true} />

                <b>search input placeholder 적용</b>
                <UIInput placeholder="placeholder 적용" label="Search + Placeholder" is_search={true} />

                <hr />

                <b>error input, hint 적용</b>
                <UIInput label="Error" hint="error hint!" error />

                <b>disabled</b>
                <UIInput readOnly label="Read Only" />

                <b>우측정렬 input</b>
                <UIInput rightaligned label="Right Aligned" />
            </div>

            <div className="container">
                <h2>textarea</h2>

                <b>default textarea</b>
                <UITextarea />

                <b>placeholder 적용 textarea</b>
                <UITextarea placeholder="placeholder 적용" />

                <b>label 적용 textarea</b>
                <UITextarea label="Label" />

                <b>hint 적용 textarea</b>
                <UITextarea hint="This is a hint" />

                <b>error+hint 적용 textarea</b>
                <UITextarea hint="This is an error message" error />

                <b>readOnly textarea</b>
                <UITextarea label="Read Only" readOnly />

                <b>disabled textarea</b>
                <UITextarea label="Disabled" disabled />
            </div>

            <div className="container">
                <h2>Select</h2>
                <p>itme3, item4 선택 시 에러상태로 변경</p>
                <b>default select</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} />

                <b>placeholder 적용 select</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} placeholder="placeholder 적용" />

                <b>label 적용 select</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} label="Select Label" />

                <b>hint 적용 select</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} hint="hint" />

                <b>error시 hint 적용 select (item3,,4 선택 시 확인 가능)</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} hint="힌트적용" />

                <b>readOnly select</b>
                {/* readOnly 속성이 없어서 disalble로 일단 해놓음 */}
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} label="Read Only" readOnly />

                <b>disabled select</b>
                <UISelect items={selectItems} onItemSelect={(item) => console.log(item)} disabled label="Disabled" />
            </div>

            <div className="container">
                <h2>DatePicker</h2>

                <b>기본 datepicker</b>
                <UIDatePicker />

                <b>placeholder 적용 datepicker</b>
                <UIDatePicker placeholder="placeholder 적용" />

                <b>label 적용 datepicker</b>
                <UIDatePicker label="labellll" />

                <b>error, hint 적용 datepicker</b>
                <UIDatePicker error hint="error hint" />

                <b>readOnly datepicker</b>
                <UIDatePicker readOnly label="Read Only" />

                <b>disabled </b>
                <UIDatePicker disabled label="Disabled" placeholder="선택안됨" />

                <b></b>
                <UIDatePicker type="date" label="Select Date" hint="hint" />

                <b></b>
                <UIDatePicker type="range" label="Select Date Range" />
            </div>

            <div className="container">
                <h2>TimePicker</h2>

                <b>default time picker</b>
                <UITimePicker />

                <b>placeholder 적용 time picker (hh:mm 형식)</b>
                <UITimePicker placeholder="15:00" />

                <b>label 적용 time picker </b>
                <UITimePicker label="Select Time" />

                <b>disabled time picker </b>
                <UITimePicker disabled />

                <b>readOnly, hint 적용 time picker </b>
                <UITimePicker readOnly hint="readOnly" />

                <b>error, hint 적용 time picker </b>
                <UITimePicker label="Select Time - error" error hint="error" />

                <b>range time picker </b>
                <UITimePicker type="range" label="Select Time - Range" />
            </div>

            <div className="container">
                <h2>button</h2>

                <b>primary button</b>
                <UIButton type="primary">버튼</UIButton>

                <b>primary button - disabled</b>
                <UIButton type="primary" disabled>
                    버튼
                </UIButton>

                <hr />
                <b>secondary button</b>
                <UIButton type="secondary">버튼</UIButton>

                <b>secondary button - disabled</b>
                <UIButton type="secondary" disabled>
                    버튼
                </UIButton>

                <hr />

                <b>secondary-border button</b>
                <UIButton type="border">버튼</UIButton>

                <b>secondary-border button - disabled</b>
                <UIButton type="border" disabled>
                    버튼
                </UIButton>

                <hr />

                <b>small button - primary</b>
                <UIButton type="primary" size="small">
                    버튼
                </UIButton>

                <b>small button - secondary</b>
                <UIButton type="secondary" size="small">
                    버튼
                </UIButton>

                <b>small button - border</b>
                <UIButton type="border" size="small">
                    버튼
                </UIButton>

                <b>small button - disabled</b>
                <UIButton type="primary" size="small" disabled>
                    버튼
                </UIButton>

                <b>small button - border disabled</b>
                <UIButton type="border" size="small" disabled>
                    버튼
                </UIButton>

                <b>small button - square</b>
                <UIButton type="secondary" size="small" shape="square">
                    버튼
                </UIButton>

                <b>small button - square disabled</b>
                <UIButton type="secondary" size="small" shape="square" disabled>
                    버튼
                </UIButton>

                <b>small button - border square</b>
                <UIButton type="border" size="small" shape="square">
                    버튼
                </UIButton>

                <b>small button - border square disabled</b>
                <UIButton type="border" size="small" shape="square" disabled>
                    버튼
                </UIButton>

                <hr />

                <b>only text button</b>
                <UIButton>버튼</UIButton>

                <b>only text button - disabled</b>
                <UIButton disabled>버튼</UIButton>
            </div>

            <div className="container">
                <h2>Tab</h2>

                <UITabs tabsData={tabsData} />
            </div>

            <div className="container">
                <h2>switch button</h2>

                <b>switch button</b>
                <UISwitchButton />

                <b>switch button + label</b>
                <UISwitchButton label="mode1" />
                <UISwitchButton label="mode2" />
                <UISwitchButton label="mode3" />

                <hr />

                <b>disabled switch button</b>

                <UISwitchButton label="mode1" disabled />
                <UISwitchButton label="mode2" disabled />
            </div>

            <div className="container">
                <h2>checkbox</h2>

                <b>default checkbox</b>
                <UICheckbox />

                <b>default checkbox + label</b>
                <UICheckbox label="label1" value="chk1" />

                <b>default checkbox - disabled</b>
                <UICheckbox label="label2" value="chk2" disabled />
                <hr />

                <b>checkbox group - single select</b>
                <UICheckbox group items={checkboxItems} mode="single" />

                <b>checkbox group - multi select</b>
                <UICheckbox group={true} items={checkboxItems} mode="multi" />
                <hr />

                <b>checkbox group - row (default)</b>
                <UICheckbox group items={checkboxItems} mode="single" direction="row" />

                <b>checkbox group - column</b>
                <UICheckbox group={true} items={checkboxItems} mode="multi" direction="column" />
            </div>

            <div className="container">
                <h2>radio</h2>

                <b>radio - row (default)</b>
                <UIRadio items={radioItems} onItemSelect={(): void => {}} />

                <b>radio - column </b>
                <UIRadio items={radioItems} direction="column" onItemSelect={(): void => {}} />
            </div>

            <div className="container">
                <h2> Chips</h2>

                <b>checkbox chips (multi select)</b>
                <UICheckboxChips items={chipsItems} name="checkbox_chips" />

                <b>radio chips (single select)</b>
                <UIRadioChips items={chipsItems} name="radio_chips" />
            </div>

            <div className="container">
                <h2>toast</h2>
                <b>basic</b>
                <UIButton type="primary" onClick={handleButtonClick}>
                    기본
                </UIButton>
                <UIToast message="This is a toast message!" open={openToast1} onOpenChange={setOpenToast1} type={null} />

                <b>confirm</b>
                <UIButton
                    type="primary"
                    onClick={() => {
                        setOpenToast2(true);
                    }}
                >
                    성공
                </UIButton>
                <UIToast message="성공~" type="success" open={openToast2} onOpenChange={setOpenToast2} />

                <b>error</b>
                <UIButton
                    type="secondary"
                    onClick={() => {
                        setOpenToast3(true);
                    }}
                >
                    실패
                </UIButton>
                <UIToast message="실패~" type="danger" open={openToast3} onOpenChange={setOpenToast3} />
            </div>

            <div className="container">
                <h2>Dialog Alert</h2>

                <b>Yes or No button</b>
                <UIAlert
                    description="입력한 내용으로 정정하시겠습니까?"
                    actionProps={{
                        onClick: () => {
                            console.log("Item deleted!");
                        },
                    }}
                >
                    <UIButton type="primary">Open Alert</UIButton>
                </UIAlert>

                <b>Yes or No button - max lines</b>
                <UIAlert
                    description="입력한 내용으로 정정하시겠습니까?입력한 내용으로 정정하시겠습니까?입력한 내용으로 정정하시겠습니까?입력한 내용으로 정정하시겠습니까?입력한 내용으로 정정하시겠습니까?"
                    actionProps={{
                        onClick: () => {
                            console.log("Item deleted!");
                        },
                    }}
                    buttons="confirm-cancel"
                >
                    <UIButton type="primary">Open Alert</UIButton>
                </UIAlert>

                <b>title & one button (confirm)</b>
                <UIAlert
                    title="알림"
                    description="입력한 내용으로 정정하시겠습니까?"
                    actionProps={{
                        onClick: () => {
                            console.log("Item deleted!");
                        },
                    }}
                    buttons="confirm"
                >
                    <UIButton type="primary">Open Alert</UIButton>
                </UIAlert>

                <b>title & one button (cancel)</b>
                <UIAlert
                    title="알림"
                    description="입력한 내용으로 정정하시겠습니까?"
                    actionProps={{
                        onClick: () => {
                            console.log("Item deleted!");
                        },
                    }}
                    buttons="cancel"
                >
                    <UIButton type="primary">Open Alert</UIButton>
                </UIAlert>
            </div>

            <div className="container">
                <h2>icon button</h2>
                <UIIconButton className="is-logout">로그아웃</UIIconButton>
                <br />
                <h2>icon button - disabled</h2>
                <UIIconButton className="is-logout" disabled>
                    로그아웃
                </UIIconButton>
                <br />
                <br />
                <h2>icon button - align : right</h2>
                <div className="flex-center gap-10">
                    <UIIconButton className="is-arrow__down align-right">더보기</UIIconButton>
                    <UIIconButton className="is-arrow__down has-pressed-action align-right">더보기</UIIconButton>
                </div>
                <br />
                <br />
                <h2>icon button - align : right disabled</h2>
                <UIIconButton className="is-arrow__down  align-right" disabled>
                    더보기
                </UIIconButton>
                <br />
                <br />
                <h2>only icon button - 20 x 20</h2>
                <div className="flex-center gap-10">
                    <UIIconButton className="is-system is-setting is-20"></UIIconButton>
                    <br />
                    <UIIconButton className="is-system is-setting is-20" />
                    <br />
                    <UIIconButton className="is-system is-setting is-20" disabled />
                </div>
                <br />
                <br />
                <h2>only icon button - 24 x 24</h2>{" "}
                <div className="flex-center gap-10">
                    <UIIconButton className="is-file has-pressed-action" />
                    <br />
                    <UIIconButton className="is-file" disabled />
                </div>
                <br />
                <br />
                <h2>only icon button - 32 x 32</h2>
                <div className="flex-center gap-10">
                    <UIIconButton className="is-back is-32 has-pressed-action" />
                    <br />
                    <UIIconButton className="is-back is-32" disabled />
                </div>
            </div>

            <div className="container">
                <h2>icon</h2>
                <div className="d-flex justify-content-center flex-wrap ptb-20 gap-30">
                    <b>20 x 20</b>

                    <div className="icon is-20 is-check"></div>
                    <div className="icon is-20 is-open"></div>
                    <div className="icon is-20 is-filter"></div>
                    <div className="icon is-20 is-plus"></div>
                    <div className="icon is-20 is-close"></div>
                    <div className="icon is-20 is-setting"></div>
                    <div className="icon is-20 is-new"></div>
                    <div className="icon is-20 is-work__outside"></div>
                    <div className="icon is-20 is-business__trip"></div>

                    <hr />

                    <b>24 x 24 : enabled + pressed</b>

                    <div className="icon is-check"></div>
                    <div className="icon is-plus"></div>
                    <div className="icon is-arrow__down"></div>
                    <div className="icon is-arrow__up"></div>
                    <div className="icon is-arrow__left"></div>
                    <div className="icon is-arrow__right"></div>
                    <div className="icon is-close"></div>
                    <div className="icon is-delete"></div>
                    <div className="icon is-ellipsis"></div>
                    <div className="icon is-search"></div>
                    <div className="icon is-calender"></div>
                    <div className="icon is-refresh"></div>
                    <div className="icon is-filter"></div>
                    <div className="icon is-setting"></div>
                    <div className="icon is-logout"></div>
                    <div className="icon is-password"></div>
                    <div className="icon is-file"></div>
                    <div className="icon is-new__window"></div>
                    <div className="icon is-edit"></div>
                    <div className="icon is-time"></div>
                    <div className="icon is-copy"></div>
                    <div className="icon is-alarm"></div>

                    <hr />

                    <b>24 x 24 : disabled</b>

                    <div className="icon is-disabled is-check"></div>
                    <div className="icon is-disabled is-plus"></div>
                    <div className="icon is-disabled is-arrow__down"></div>
                    <div className="icon is-disabled is-arrow__up"></div>
                    <div className="icon is-disabled is-arrow__left"></div>
                    <div className="icon is-disabled is-arrow__right"></div>
                    <div className="icon is-disabled is-close"></div>
                    <div className="icon is-disabled is-delete"></div>
                    <div className="icon is-disabled is-ellipsis"></div>
                    <div className="icon is-disabled is-search"></div>
                    <div className="icon is-disabled is-calender"></div>
                    <div className="icon is-disabled is-refresh"></div>
                    <div className="icon is-disabled is-filter"></div>
                    <div className="icon is-disabled is-setting"></div>
                    <div className="icon is-disabled is-logout"></div>
                    <div className="icon is-disabled is-password"></div>
                    <div className="icon is-disabled is-file"></div>
                    <div className="icon is-disabled is-new__window"></div>
                    <div className="icon is-disabled is-edit"></div>
                    <div className="icon is-disabled is-time"></div>
                    <div className="icon is-disabled is-copy"></div>
                    <div className="icon is-disabled is-alarm"></div>

                    <hr />

                    <b>24 x 24 : inverse</b>
                    <div style={{ backgroundColor: "green" }} className="d-flex justify-content-center flex-wrap ptb-20 gap-30">
                        <div className="icon is-inverse is-check"></div>
                        <div className="icon is-inverse is-plus"></div>
                        <div className="icon is-inverse is-arrow__down"></div>
                        <div className="icon is-inverse is-arrow__up"></div>
                        <div className="icon is-inverse is-arrow__left"></div>
                        <div className="icon is-inverse is-arrow__right"></div>
                        <div className="icon is-inverse is-close"></div>
                        <div className="icon is-inverse is-delete"></div>
                        <div className="icon is-inverse is-ellipsis"></div>
                        <div className="icon is-inverse is-search"></div>
                        <div className="icon is-inverse is-calender"></div>
                        <div className="icon is-inverse is-refresh"></div>
                        <div className="icon is-inverse is-filter"></div>
                        <div className="icon is-inverse is-setting"></div>
                        <div className="icon is-inverse is-logout"></div>
                        <div className="icon is-inverse is-password"></div>
                        <div className="icon is-inverse is-file"></div>
                        <div className="icon is-inverse is-new__window"></div>
                        <div className="icon is-inverse is-edit"></div>
                        <div className="icon is-inverse is-time"></div>
                        <div className="icon is-inverse is-copy"></div>
                        <div className="icon is-inverse is-alarm"></div>
                    </div>

                    <hr />

                    <b>system icon</b>

                    <div className="icon is-system is-annotation"></div>
                    <div className="icon is-system is-danger"></div>
                    <div className="icon is-system is-warning"></div>
                    <div className="icon is-system is-success"></div>
                    <div className="icon is-system is-info"></div>
                    <div className="icon is-system is-setting"></div>

                    <hr />

                    <b>32 x 32</b>

                    <div className="icon is-32 is-close"></div>
                    <div className="icon is-32 is-back"></div>
                    <div className="icon is-32 is-menu"></div>
                    <div className="icon is-32 is-search"></div>
                    <div className="icon is-32 is-alarm"></div>
                    <div className="icon is-32 is-user"></div>

                    <hr />

                    <b>32 x 32 : inverse</b>
                    <div style={{ backgroundColor: "green" }} className="d-flex justify-content-center flex-wrap ptb-20 gap-30">
                        <div className="icon is-32 is-inverse is-close"></div>
                        <div className="icon is-32 is-inverse is-back"></div>
                        <div className="icon is-32 is-inverse is-menu"></div>
                        <div className="icon is-32 is-inverse is-search"></div>
                        <div className="icon is-32 is-inverse is-alarm"></div>
                        <div className="icon is-32 is-inverse is-user"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
