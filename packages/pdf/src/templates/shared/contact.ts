type WebsiteDisplay = {
	url: string;
	label?: string | undefined;
};

type CustomFieldLink = {
	link?: string | undefined;
};

export const getWebsiteDisplayText = (website: WebsiteDisplay | undefined): string => {
	if (!website) return "";
	const label = website.label?.trim();

	return label || website.url;
};

export const getCustomFieldLinkUrl = (field: CustomFieldLink): string | undefined => {
	const link = field.link?.trim();

	return link || undefined;
};
