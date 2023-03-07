import { Button, ButtonProps, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FiCheck, FiClipboard, FiCopy } from "react-icons/fi";

function CopyButton({
  onCopy,
  iconOnly = false,
  ...props
}: {
  onCopy: () => void;
  iconOnly?: boolean;
} & ButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <Button
      colorScheme="green"
      onClick={() => {
        onCopy();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 1000);
      }}
      size="sm"
      variant={isCopied ? "solid" : "outline"}
      {...props}
    >
      <Icon as={isCopied ? FiCheck : FiCopy} mr={iconOnly ? 0 : 2} />
      {iconOnly ? "" : isCopied ? "Copied!" : "Copy"}
    </Button>
  );
}

export default CopyButton;
