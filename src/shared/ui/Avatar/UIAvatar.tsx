import * as Avatar from "@radix-ui/react-avatar";
import "./UIAvatar.scss";

// 기본 이미지 경로 설정
import defaultAvatar from "@/assets/images/avatar__default.png";

type AvatarProps = {
    src?: string;
    fallback?: string;
    alt?: string;
    size?: string;
    icon?: string;
};

export const UIAvatar = ({ src, size, fallback = "Avatar", alt = "Avatar", icon }: AvatarProps) => {
    const handleClick = () => {
        console.log("click!");
    };

    return (
        <div className={`avatarBox is-${size}`}>
            <Avatar.Root className={`avatar__root`} onClick={handleClick}>
                <Avatar.Image className="avatar" src={src || defaultAvatar} alt={alt} />
                <Avatar.Fallback delayMs={600}>
                    <img src={fallback} />
                </Avatar.Fallback>
            </Avatar.Root>
            <div className={`avatar__icon icon is-${icon}`}></div>
        </div>
    );
};
