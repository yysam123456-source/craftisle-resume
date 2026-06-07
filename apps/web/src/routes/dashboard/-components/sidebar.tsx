import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { BrainIcon, ChatCircleDotsIcon, GearSixIcon, ReadCvLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@reactive-resume/ui/components/sidebar";
import { UserDropdownMenu } from "@/features/user/dropdown-menu";

type SidebarItem = {
	icon: React.ReactNode;
	label: MessageDescriptor;
	href: React.ComponentProps<typeof Link>["to"];
};

const appSidebarItems = [
	{
		icon: <ReadCvLogoIcon />,
		label: msg`Resumes`,
		href: "/dashboard/resumes",
	},
	{
		icon: <ChatCircleDotsIcon />,
		label: msg`Agents`,
		href: "/agent",
	},
] as const satisfies SidebarItem[];

const settingsSidebarItems = [
	{
		icon: <GearSixIcon />,
		label: msg`Preferences`,
		href: "/dashboard/settings/preferences",
	},
	{
		icon: <BrainIcon />,
		label: msg`Integrations`,
		href: "/dashboard/settings/integrations",
	},
] as const satisfies SidebarItem[];

type SidebarItemListProps = {
	items: readonly SidebarItem[];
};

function SidebarItemList({ items }: SidebarItemListProps) {
	const { i18n } = useLingui();

	return (
		<SidebarMenu>
			{items.map((item) => (
				<SidebarMenuItem key={item.href}>
					<SidebarMenuButton
						title={i18n.t(item.label)}
						render={
							<Link to={item.href} activeProps={{ className: "bg-sidebar-accent" }}>
								{item.icon}
								<span className="shrink-0 transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
									{i18n.t(item.label)}
								</span>
							</Link>
						}
					/>
				</SidebarMenuItem>
			))}
		</SidebarMenu>
	);
}

export function DashboardSidebar() {
	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="h-auto justify-center"
							render={
								<Link to="/">
									<BrandIcon variant="icon" className="size-6" />
									<h1 className="sr-only">Craftisle Resume</h1>
								</Link>
							}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>
						<Trans>App</Trans>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarItemList items={appSidebarItems} />
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>
						<Trans>Settings</Trans>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarItemList items={settingsSidebarItems} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			<SidebarFooter className="gap-y-0">
				<SidebarMenu>
					<SidebarMenuItem>
						<UserDropdownMenu>
							{() => (
								<SidebarMenuButton className="h-auto gap-x-3 group-data-[collapsible=icon]:p-1!">
									<div className="transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
										<p className="font-medium">Settings</p>
									</div>
								</SidebarMenuButton>
							)}
						</UserDropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
