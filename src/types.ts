type SitemapEntry = {
	location: URL
	lastModified?: Date
	changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
	priority?: number
}

type SitemapIndexEntry = {
	location: URL
	lastModified?: Date
}
