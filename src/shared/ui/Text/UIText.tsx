import { Text } from '@radix-ui/themes';
import './UIText.scss';

type TextProps = React.ComponentProps<typeof Text>;

export const UIText = (props: TextProps) => (
  <Text {...props} className="textext" />
);