import type { Website } from "@reactive-resume/schema/resume/data";

type ItemWebsite = Website & {
	inlineLink?: boolean | undefined;
};

export const getInlineItemWebsiteUrl = (website: ItemWebsite | undefined): string | undefined => {
	if (!website?.url || !website.inlineLink) return undefined;

	return website.url;
};

export const shouldRenderSeparateItemWebsite = (website: ItemWebsite | undefined): boolean => {
	if (!website) return false;
	return Boolean(website.url && !website.inlineLink);
};
