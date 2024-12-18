import { UIInput, UISelect } from "@/shared/ui";

export const UserInquiry = () => {

  return (
    <div>
      <div>
        <UISelect items={[]} onItemSelect={() => {}} />
      </div>
      <div>
        <UISelect items={[]} onItemSelect={() => {}} />
      </div>
      <div>
        <UIInput />
      </div>
    </div>
  );
};