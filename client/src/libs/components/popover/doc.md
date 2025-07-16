---
category: Ui
title: Popover
---

Popover giống polaris (code gọn hơn)

```ts
  import { Popover, PopoverRefResponse } from '@xobuilder/ui';

  const ref = useRef<PopoverRefResponse>();

  const handleClick = () => {
    console.log('Toggle open popover ');
    ref.current?.togglePopover();
  };

  return (
    <Popover ref={ref} button={{ variant: 'plain', icon: PlusMinor }}>
      <button onClick={handleClick}></button>
    </Popover>
  );
```
