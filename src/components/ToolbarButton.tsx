import { IconButtonProps, Tooltip, IconButton } from "@chakra-ui/react";

const ToolbarButton = ({
  label,
  icon,
  onClick,
  ...props
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
} & Omit<IconButtonProps, "aria-label">) => {
  return (
    <Tooltip label={label}>
      <IconButton
        ml="auto"
        aria-label={label}
        icon={icon}
        size="sm"
        boxShadow="md"
        onClick={onClick}
        {...props}
      />
    </Tooltip>
  );
};

export default ToolbarButton;
