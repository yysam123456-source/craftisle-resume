import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { GridFourIcon, ListIcon, ReadCvLogoIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import z from "zod";
import { Label } from "@reactive-resume/ui/components/label";
import { Separator } from "@reactive-resume/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@reactive-resume/ui/components/tabs";
import { cn } from "@reactive-resume/utils/style";
import { Combobox } from "@/components/ui/combobox";
import { getResumeMetadata } from "@/libs/local-resume";
import { DashboardHeader } from "../-components/header";
import { GridView } from "./-components/grid-view";
import { ListView } from "./-components/list-view";

type SortOption = "lastUpdatedAt" | "createdAt" | "name";

const searchSchema = z.object({
  tags: z.array(z.string()).default([]),
  sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).default("lastUpdatedAt"),
  view: z.enum(["grid", "list"]).default("grid"),
});

type Search = z.output<typeof searchSchema>;

const defaultSearch: Search = { tags: [], sort: "lastUpdatedAt", view: "grid" };

export const Route = createFileRoute("/dashboard/resumes/")({
  component: RouteComponent,
  validateSearch: searchSchema,
  search: {
    middlewares: [stripSearchParams(defaultSearch)],
  },
});

function RouteComponent() {
  const { i18n } = useLingui();
  const { tags, sort, view } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  // Load resume metadata from localStorage
  const allResumes = useMemo(() => getResumeMetadata(), []);
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allResumes.forEach((r) => r.tags.forEach((t: string) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [allResumes]);

  const tagOptions = useMemo(() => {
    return allTags.map((tag) => ({ value: tag, label: tag }));
  }, [allTags]);

  const sortOptions = useMemo(() => {
    return [
      { value: "lastUpdatedAt", label: i18n.t("Last Updated") },
      { value: "createdAt", label: i18n.t("Created") },
      { value: "name", label: i18n.t("Name") },
    ];
  }, [i18n]);

  // Filter & sort
  const displayedResumes = useMemo(() => {
    let list = [...allResumes];
    if (tags.length > 0) {
      list = list.filter((r) => tags.every((t: string) => r.tags.includes(t)));
    }
    switch (sort) {
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "createdAt":
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "lastUpdatedAt":
      default:
        list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }
    return list;
  }, [allResumes, tags, sort]);

  return (
    <div className="space-y-4">
      <DashboardHeader icon={ReadCvLogoIcon} title={t`Resumes`} />

      <Separator />

      <div className="flex items-center gap-x-4">
        <div className="flex gap-2">
          <Label>
            <Trans>Sort by</Trans>
          </Label>
          <Combobox
            value={sort}
            options={sortOptions}
            placeholder={t`Sort by`}
            onValueChange={(value) => {
              if (!value) return;
              void navigate({ search: (prev: Search) => ({ ...prev, sort: value as SortOption }) });
            }}
          />
        </div>

        <div className={cn("flex gap-2", { hidden: tagOptions.length === 0 })}>
          <Label>
            <Trans>Filter by</Trans>
          </Label>
          <Combobox
            multiple
            value={tags}
            options={tagOptions}
            placeholder={t`Filter by`}
            onValueChange={(value) => {
              void navigate({ search: (prev: Search) => ({ ...prev, tags: value ?? [] }) });
            }}
          />
        </div>

        <Tabs className="ltr:ms-auto rtl:me-auto" value={view}>
          <TabsList>
            <TabsTrigger
              value="grid"
              nativeButton={false}
              className="rounded-r-none"
              render={<Link to="." search={(prev: Search) => ({ ...prev, view: "grid" })} />}
            >
              <GridFourIcon />
              <Trans>Grid</Trans>
            </TabsTrigger>

            <TabsTrigger
              value="list"
              nativeButton={false}
              className="rounded-l-none"
              render={<Link to="." search={(prev: Search) => ({ ...prev, view: "list" })} />}
            >
              <ListIcon />
              <Trans>List</Trans>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "list" ? <ListView resumes={displayedResumes} /> : <GridView resumes={displayedResumes} />}
    </div>
  );
}
