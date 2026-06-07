import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	HouseSimpleIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	SidebarSimpleIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@reactive-resume/ui/components/button";
import { useDialogStore } from "@/dialogs/store";
import { useCurrentResume, usePatchResume } from "@/features/resume/builder/draft";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteResume, updateResumeMetadata } from "@/libs/local-resume";
import { useBuilderSidebar } from "../-store/sidebar";

export function BuilderHeader() {
	const resume = useCurrentResume();
	const name = resume.name;
	const isLocked = resume.isLocked;
	const toggleSidebar = useBuilderSidebar((state) => state.toggleSidebar);

	return (
		<div className="absolute inset-x-0 top-0 z-50 flex h-14 items-center justify-between border-b bg-popover px-1.5">
			<Button size="icon" variant="ghost" onClick={() => toggleSidebar("left")}>
				<SidebarSimpleIcon />
				<span className="sr-only">
					<Trans comment="Screen-reader label for opening or closing the left sidebar in resume builder">
						Toggle left sidebar
					</Trans>
				</span>
			</Button>

			<div className="flex items-center gap-x-1">
				<Button
					size="icon"
					variant="ghost"
					aria-label={t({
						comment: "Accessible label for button navigating from builder to resumes dashboard",
						message: "Go to resumes dashboard",
					})}
					nativeButton={false}
					render={
						<Link to="/dashboard/resumes" search={{ sort: "lastUpdatedAt", tags: [] }}>
							<HouseSimpleIcon />
						</Link>
					}
				/>
				<span className="me-2.5 text-muted-foreground">/</span>
				<h2 className="flex-1 truncate font-medium">{name}</h2>
				{isLocked && <LockSimpleIcon className="ms-2 text-muted-foreground" />}
				<BuilderHeaderActions />
			</div>

			<Button size="icon" variant="ghost" onClick={() => toggleSidebar("right")}>
				<SidebarSimpleIcon className="-scale-x-100" />
				<span className="sr-only">
					<Trans comment="Screen-reader label for opening or closing the right sidebar in resume builder">
						Toggle right sidebar
					</Trans>
				</span>
			</Button>
		</div>
	);
}

function BuilderHeaderActions() {
	const confirm = useConfirm();
	const navigate = useNavigate();
	const { openDialog } = useDialogStore();

	const resume = useCurrentResume();
	const patchResume = usePatchResume();
	const id = resume.id;
	const name = resume.name;
	const slug = resume.slug;
	const tags = resume.tags;
	const isLocked = resume.isLocked;

	const handleUpdate = () => {
		openDialog("resume.update", { id, name, slug, tags });
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", { id, name, slug, tags, shouldRedirect: true });
	};

	const handleToggleLock = async () => {
		if (!isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});
			if (!confirmation) return;
		}

		updateResumeMetadata(id, { isLocked: !isLocked });
		patchResume((draft) => {
			draft.isLocked = !isLocked;
		});
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});
		if (!confirmation) return;

		deleteResume(id);
		void navigate({ to: "/dashboard/resumes", search: { sort: "lastUpdatedAt", tags: [] } });
	};

	return (
		<div className="ms-2 flex items-center gap-0.5 rounded-md bg-background/60 px-1 py-0.5">
			<Button
				size="icon"
				variant="ghost"
				className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
				disabled={isLocked}
				onClick={handleUpdate}
				title={t`Update`}
			>
				<PencilSimpleLineIcon className="size-4" />
			</Button>
			<Button
				size="icon"
				variant="ghost"
				className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
				onClick={handleDuplicate}
				title={t`Duplicate`}
			>
				<CopySimpleIcon className="size-4" />
			</Button>
			<Button
				size="icon"
				variant="ghost"
				className="size-7 text-foreground/70 hover:bg-primary/15 hover:text-primary"
				onClick={handleToggleLock}
				title={isLocked ? t`Unlock` : t`Lock`}
			>
				{isLocked ? <LockSimpleOpenIcon className="size-4" /> : <LockSimpleIcon className="size-4" />}
			</Button>
			<Button
				size="icon"
				variant="ghost"
				className="size-7 text-foreground/70 hover:bg-destructive/15 hover:text-destructive"
				disabled={isLocked}
				onClick={handleDelete}
				title={t`Delete`}
			>
				<TrashSimpleIcon className="size-4" />
			</Button>
		</div>
	);
}
