import { useContextMenu } from "../ContextMenu/useContextMenu";

export default function ContextMenuExample() {
  const { ContextMenuWrapper, ContextMenuTrigger, MenuItem, triggerData } = useContextMenu();
  // create and style your context menu
  const ContextMenu = () => {
    return (
      <ContextMenuWrapper>
        <div className="flex flex-col p-4 bg-white rounded-lg border-sky-100 border">
          {/* MenuItem hides menu on click, can accept data and mouseEvent from ContextMenuTrigger */}
          <MenuItem
            onClick={() => {
              console.log(`Detect click on`, triggerData);
              const target = triggerData.event?.target as HTMLElement;
              console.log(target.getBoundingClientRect());
            }}
            className="cursor-pointer"
          >
            <h5 className="w-max">Click to action</h5>
          </MenuItem>
        </div>
      </ContextMenuWrapper>
    );
  };

  return (
    <div>
      <h5>Context Menu</h5>
      <ContextMenu />
      <div className="w-fit px-4 py-3 rounded bg-slate-200 text-center flex flex-col gap-4 ">
        {Array.from({ length: 6 }).map((el, i) => (
          // wrap content with ContextMenuTrigger to show context menu and pass data if you need
          <ContextMenuTrigger key={i} data={{ index: i }}>
            <h5 className="w-full">Trigger context menu with data = {JSON.stringify({ index: i })}</h5>
          </ContextMenuTrigger>
        ))}
      </div>
    </div>
  );
}
