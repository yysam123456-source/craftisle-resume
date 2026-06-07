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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@reactive-resume/ui/components/dropdown-menu";
import { useDialogStore } from "@/dialogs/store";
import { useConfirm } from "@/hooks/use-confirm";
import { deleteResume, updateResumeMetadata } from "@/libs/local-resume";

type Props = Omit<React.ComponentProps<typeof DropdownMenuContent>, "children"> & {
	resume: ResumeMetadata;
	children: React.ComponentProps<typeof DropdownMenuTrigger>["render"];
};

export function ResumeDropdownMenu({ resume, children, ...props }: Props) {
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
		<DropdownMenu>
			<DropdownMenuTrigger render={children} />

			<DropdownMenuContent {...props}>
				<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
					<DropdownMenuItem>
						<FolderOpenIcon />
						<Trans comment="Resume card dropdown action to open the resume editor">Open</Trans>
					</DropdownMenuItem>
				</Link>

				<DropdownMenuSeparator />

				<DropdownMenuItem disabled={resume.isLocked} onClick={handleUpdate}>
					<PencilSimpleLineIcon />
					<Trans comment="Resume card dropdown action to edit resume metadata">Update</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={handleDuplicate}>
					<CopySimpleIcon />
					<Trans comment="Resume card dropdown action to create a copy">Duplicate</Trans>
				</DropdownMenuItem>

				<DropdownMenuItem onClick={handleToggleLock}>
					{resume.isLocked ? <LockSimpleOpenIcon /> : <LockSimpleIcon />}
					{resume.isLocked ? (
						<Trans comment="Resume card dropdown action to remove edit lock">Unlock</Trans>
					) : (
						<Trans comment="Resume card dropdown action to prevent edits">Lock</Trans>
					)}
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive" disabled={resume.isLocked} onClick={handleDelete}>
					<TrashSimpleIcon />
					<Trans comment="Resume card dropdown destructive action to remove a resume">Delete</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
