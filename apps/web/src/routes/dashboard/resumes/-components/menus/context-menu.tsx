import type { ResumeMetadata } from "@/libs/local-resume";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CopySimpleIcon,
	FolderOpenIcon,
	LockSimpleIcon,
	LockSimpleOpenIcon,
	PencilSimpleLineIcon,
	TrashSimpleIcon,
} from "@phosphor-icons/react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@reactive-resume/ui/components/context-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteResume, updateResumeMetadata } from "@/libs/local-resume";

type Props = {
	resume: ResumeMetadata;
	children: React.ComponentProps<typeof ContextMenuTrigger>["render"];
};

export function ResumeContextMenu({ resume, children }: Props) {
	const confirm = useConfirm();
	const { openDialog } = useDialogStore();
	const queryClient = useQueryClient();

	const handleUpdate = () => {
		openDialog("resume.update", resume);
	};

	const handleDuplicate = () => {
		openDialog("resume.duplicate", resume);
	};

	const handleToggleLock = async () => {
		if (!resume.isLocked) {
			const confirmation = await confirm(t`Are you sure you want to lock this resume?`, {
				description: t`When locked, the resume cannot be updated or deleted.`,
			});

			if (!confirmation) return;
		}

		updateResumeMetadata(resume.id, { isLocked: !resume.isLocked });
		void queryClient.invalidateQueries({ queryKey: ["resumes-local"] });
		toast.success(resume.isLocked ? t`Resume unlocked.` : t`Resume locked.`);
	};

	const handleDelete = async () => {
		const confirmation = await confirm(t`Are you sure you want to delete this resume?`, {
			description: t`This action cannot be undone.`,
		});

		if (!confirmation) return;

		const toastId = toast.loading(t`Deleting your resume...`);

		try {
			deleteResume(resume.id);
			void queryClient.invalidateQueries({ queryKey: ["resumes-local"] });
			toast.success(t`Your resume has been deleted successfully.`, { id: toastId });
		} catch (error) {
			toast.error(t`Failed to delete resume.`, { id: toastId });
		}
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger render={children} />

			<ContextMenuContent>
				<ContextMenuItem
					render={
						<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
							<FolderOpenIcon />
							<Trans comment="Resume card context menu action to open the resume editor">Open</Trans>
						</Link>
					}
				/>

				<ContextMenuSeparator />

				<ContextMenuItem disabled={resume.isLocked} onClick={handleUpdate}>
					<PencilSimpleLineIcon />
					<Trans comment="Resume card context menu action to edit resume metadata">Update</Trans>
				</ContextMenuItem>

				<ContextMenuItem onClick={handleDuplicate}>
					<CopySimpleIcon />
					<Trans comment="Resume card context menu action to create a copy">Duplicate</Trans>
				</ContextMenuItem>

				<ContextMenuItem onClick={handleToggleLock}>
					{resume.isLocked ? <LockSimpleOpenIcon /> : <LockSimpleIcon />}
					{resume.isLocked ? (
						<Trans comment="Resume card context menu action to remove edit lock">Unlock</Trans>
					) : (
						<Trans comment="Resume card context menu action to prevent edits">Lock</Trans>
					)}
				</ContextMenuItem>

				<ContextMenuSeparator />

				<ContextMenuItem variant="destructive" disabled={resume.isLocked} onClick={handleDelete}>
					<TrashSimpleIcon />
					<Trans comment="Resume card context menu destructive action to remove a resume">Delete</Trans>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
