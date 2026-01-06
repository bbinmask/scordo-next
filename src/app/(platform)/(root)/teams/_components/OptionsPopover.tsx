import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface OptionsPopoverProps {}

const OptionsPopover = ({}: OptionsPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger>Open</PopoverTrigger>
      <PopoverContent>Place content for the popover here.</PopoverContent>
    </Popover>
  );
};

export default OptionsPopover;
