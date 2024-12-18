import { Link } from '@radix-ui/themes';
import './UILink.scss';

type LinkProps = React.ComponentProps<typeof Link>;

export const UILink = (props: LinkProps) => (
	<Link {...props} className="lllll"/>
);