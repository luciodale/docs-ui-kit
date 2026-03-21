export type NavLink = {
	href: string;
	label: string;
};

export type SocialLinks = {
	github: string;
	linkedin?: string;
};

export type SidebarSection = {
	title: string;
	links: Array<NavLink>;
};

export type SiteConfig = {
	title: string;
	description: string;
	siteUrl: string;
	installCommand: string;
	logoSrc?: string;
	logoAlt?: string;
	ogImage?: string;
	faviconSrc?: string;
	githubUrl: string;
	author?: string;
	twitterHandle?: string;
	socialLinks: SocialLinks;
	navLinks: Array<NavLink>;
	sidebarSections: Array<SidebarSection>;
	copyright?: string;
};
