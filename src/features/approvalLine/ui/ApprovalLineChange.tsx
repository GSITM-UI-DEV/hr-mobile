import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuSub
} from '@radix-ui/react-navigation-menu';
import { UIButton, UICheckbox, UIIconButton, UIInput } from "@/shared/ui";
import "./ApprovalLineChange.scss";
import { useEffect, useRef, useState } from 'react';

export const ApprovalLineChange = () => {
  const triggerRef4 = useRef<HTMLButtonElement>(null); // Trigger 참조
  const [isOpen, setIsOpen] = useState(false); // 열림 상태 관리

  const toggleMenu = () => setIsOpen((prev) => !prev); // 토글 함수

  useEffect(() => {
    const triggerElement = triggerRef4.current;

    if (triggerElement) {
      // 데이터 속성으로 상태 반영
      triggerElement.setAttribute('data-state', isOpen ? 'open' : 'closed');
    }
  }, [isOpen]); // isOpen이 변경될 때마다 실행






  const checkboxItems = [
    { label: "홍길동", value: "value1" },
    { label: "홍동", value: "value2" },
    { label: "홍길", value: "value3" },
    { label: "길동", value: "value4" },
  ];



  return (
    <>
      <div className="approval__search mt-80">
        <UIInput placeholder="부서명 또는 직원명으로 검색해주세요" is_search={true} />
      </div>

      <div className="count__control">
        <div className="count">총 <em>3</em> 명</div>
      </div>
      
      <div className="approval__org">
        <NavigationMenu className="orgs">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger asChild>
                <div className="name">
                  <UIIconButton className="is-plus is-32 has-pressed-action" />
                  <span>경영본부</span>
                </div>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuSub>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger asChild>
                        <div className="name">
                          <UIIconButton className="is-plus is-32 has-pressed-action" />
                          <span>경영1팀</span>
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <NavigationMenuSub>
                          <NavigationMenuList>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger asChild>
                                <div className="name">
                                  <UIIconButton className="is-plus is-32 has-pressed-action" />
                                  <span >11파트</span>
                                </div>
                              </NavigationMenuTrigger>
                              <NavigationMenuContent>
                                <UICheckbox group={true} items={checkboxItems} mode="multi" direction="column" />
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                              <NavigationMenuTrigger asChild>
                                <div className="name">
                                  <UIIconButton className="is-plus is-32 has-pressed-action" />
                                  <span >22파트</span>
                                </div>
                              </NavigationMenuTrigger>
                              <NavigationMenuContent>
                                <UICheckbox group={true} items={checkboxItems} mode="multi" direction="column" />
                              </NavigationMenuContent>
                            </NavigationMenuItem>
                          </NavigationMenuList>
                        </NavigationMenuSub>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger asChild ref={triggerRef4} onClick={toggleMenu}>
                        <div className="name">
                          <UIIconButton className="is-plus is-32 has-pressed-action" />
                          <span >경영2팀</span>
                        </div>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <UICheckbox group={true} items={checkboxItems} mode="multi" direction="column" />
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenuSub>
              </NavigationMenuContent>
            </NavigationMenuItem>










            {/* <NavigationMenuItem>
              <NavigationMenuTrigger>영업본부</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink>영업1팀</NavigationMenuLink>
                <NavigationMenuLink>영업2팀</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem> */}



          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  )
}