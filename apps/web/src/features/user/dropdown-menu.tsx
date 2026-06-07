import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { PaletteIcon, TranslateIcon } from "@phosphor-icons/react";
import { useIsClient } from "usehooks-ts";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@reactive-resume/ui/components/dropdown-menu";
import { useTheme } from "@/features/theme/provider";
import { isLocale, loadLocale, localeMap, setLocaleCookie } from "@/libs/locale";
import { isTheme } from "@/libs/theme";

type Props = {
	children: () => React.ComponentProps<typeof DropdownMenuTrigger>["render"];
};

export function UserDropdownMenu({ children }: Props) {
	const isClient = useIsClient();
	const { i18n } = useLingui();
	const { theme, setTheme } = useTheme();

	const handleThemeChange = (value: string) => {
		if (!isTheme(value)) return;
		setTheme(value);
	};

	const handleLocaleChange = async (value: string) => {
		if (!isLocale(value)) return;
		setLocaleCookie(value);
		await loadLocale(value);
		window.location.reload();
	};

	if (!isClient) return null;

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={children()} />

			<DropdownMenuContent align="start" side="top">
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<TranslateIcon />
							<Trans comment="Menu item that opens language selection submenu">Language</Trans>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent className="max-h-[400px] overflow-y-auto">
							<DropdownMenuRadioGroup value={i18n.locale} onValueChange={handleLocaleChange}>
								{Object.entries(localeMap).map(([value, label]) => (
									<DropdownMenuRadioItem key={value} value={value}>
										{i18n.t(label)}
									</DropdownMenuRadioItem>
								))}
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>

					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<PaletteIcon />
							<Trans comment="Menu item that opens appearance theme selection submenu">Theme</Trans>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
								<DropdownMenuRadioItem value="light">
									<Trans comment="Appearance theme option for light mode">Light</Trans>
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">
									<Trans comment="Appearance theme option for dark mode">Dark</Trans>
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
