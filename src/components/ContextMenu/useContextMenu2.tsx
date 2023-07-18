import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import TipPositionHelper from "../Tip/TipPositionHelper";

type triggerData = { event: React.MouseEvent<HTMLElement, MouseEvent> | null; data: any | null };
type ContextMenuWrapper = { className?: string; children: ReactElement };
type MenuItem = {
	className?: string;
	children: ReactElement;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
type ContextMenuTrigger = { children: ReactElement; data?: any };

export const useContextMenu2 = () => {
	const [isOpen, setIsOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement | null>(null);
	const triggerData = useRef<triggerData>({
		event: null,
		data: null,
	});

	const handleOpen = () => {
		setIsOpen(true);
	};

	const hide = () => {
		setIsOpen(false);
		triggerData.current.data = null;
		triggerData.current.event = null;
	};

	const ContextMenuWrapper = useCallback(
		({ className, children }: ContextMenuWrapper) => {
			return (
				<TipPositionHelper
					isOpen={isOpen}
					tip={<div ref={menuRef}>{children}</div>}
					customCords={() => {
						const event = triggerData.current.event;

						if (!event) return { top: 0, left: 0 }

						const clickX = event.clientX;
						const clickY = event.clientY;

						return { left: clickX, top: clickY }
					}}
					onBottomOverflow={({ prevCords, tipEl }) => {
						return { ...prevCords, top: window.innerHeight - tipEl.offsetHeight }
					}}
				>
					{<div className="contents"></div>}
				</TipPositionHelper>

			);
		},
		[isOpen]
	);

	const MenuItem = useCallback(({ className, onClick, children }: MenuItem) => {
		return (
			<div
				{...{ className }}
				onClick={(e) => {
					onClick && onClick(e);
					hide();
				}}
			>
				{children}
			</div>
		);
	}, []);

	const ContextMenuTrigger = useCallback(({ children, data }: ContextMenuTrigger) => {
		return (
			<div
				className="contents"
				onContextMenu={(event) => {
					event.preventDefault();

					triggerData.current.event = event;
					if (data) triggerData.current.data = data;

					handleOpen();
				}}
			>
				{children}
			</div>
		);
	}, []);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const target = event.target;

			if (target instanceof Node && menuRef.current) {
				const isOnMenu = menuRef.current.contains(target);

				if (!isOnMenu) hide();
			}
		};

		window.addEventListener("mousedown", handleClick);

		return () => window.removeEventListener("mousedown", handleClick);
	}, []);

	return {
		ContextMenuTrigger,
		ContextMenuWrapper,
		MenuItem,
		triggerData: triggerData.current,
		isOpen,
		hide,
	};
};
