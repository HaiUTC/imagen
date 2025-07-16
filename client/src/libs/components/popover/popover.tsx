import {
  Button,
  type ButtonProps,
  Popover,
  type PopoverProps,
} from "@shopify/polaris";
import { forwardRef, useImperativeHandle, useState } from "react";

export interface PopoverCustomProps
  extends Omit<PopoverProps, "activator" | "onClose" | "active"> {
  title?: string;
  activator?: React.ReactElement;
  children: React.ReactNode;
  button?: ButtonProps;
  onClose?: () => void;
}

export interface PopoverRefResponse {
  active: boolean;
  togglePopover: () => void;
}

export const PopoverRef = forwardRef(function PopoverCustom(
  {
    title,
    activator,
    children,
    button,
    onClose,
    ...popoverProps
  }: PopoverCustomProps,
  ref
) {
  const [popoverActive, setPopoverActive] = useState<boolean>(false);

  const togglePopoverActive = () => {
    setPopoverActive(!popoverActive);
  };

  const activatorDefault = (
    <Button
      {...button}
      fullWidth
      variant="tertiary"
      onClick={togglePopoverActive}
    >
      {title}
    </Button>
  );

  useImperativeHandle(ref, () => ({
    active: popoverActive,
    togglePopover() {
      togglePopoverActive();
    },
  }));

  return (
    <Popover
      active={popoverActive}
      activator={activator || activatorDefault}
      onClose={onClose || togglePopoverActive}
      {...popoverProps}
    >
      <Popover.Pane>{children}</Popover.Pane>
    </Popover>
  );
});
