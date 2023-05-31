import { DOMParser } from 'linkedom'
import { NodeStruct } from 'linkedom/types/mixin/parent-node'

export function parseSitemap(text: string, strict: boolean = true): SitemapEntry[] | SitemapIndexEntry[] {
	const document = new DOMParser().parseFromString(text, 'text/xml')

	const urlSetNode = document.querySelector('urlset')

	if (urlSetNode) {
		const entries: SitemapEntry[] = []

		for (const urlNode of <NodeStruct[]>urlSetNode.querySelectorAll('url')) {
			let entry: SitemapEntry

			const locationNode = urlNode.querySelector('loc')

			if (locationNode) {
				const location = locationNode.textContent

				try {
					entry = {
						location: new URL(location)
					}
				} catch (error) {
					if (strict) {
						throw new Error(`Failed to parse location URL (${location}): ${error.message}`)
					}
					console.warn(`Skipping entry due to invalid location URL (${location}): ${error.message}`)
					continue
				}
			} else {
				if (strict) {
					throw new Error('Missing location node in entry')
				}
				console.warn('Skipping entry due to missing location node')
				continue
			}

			const lastModifiedNode = urlNode.querySelector('lastmod')

			if (lastModifiedNode) {
				const lastModified = lastModifiedNode.textContent

				try {
					entry.lastModified = new Date(lastModified)
				} catch (error) {
					if (strict) {
						throw new Error(`Failed to parse last modified date (${lastModified}): ${error.message}`)
					}
					console.warn(`Skipping lastModified property due to invalid date (${lastModified}): ${error.message}`)
				}
			}

			const changeFrequencyNode = urlNode.querySelector('changefreq')

			if (changeFrequencyNode) {
				const changeFrequency = changeFrequencyNode.textContent

				if (['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].includes(changeFrequency)) {
					entry.changeFrequency = changeFrequency
				} else {
					if (strict) {
						throw new Error(`Invalid change frequency interval: ${changeFrequency}`)
					}
					console.warn(`Skipping changeFrequency property due to invalid interval: ${changeFrequency}`)
				}
			}

			const priorityNode = urlNode.querySelector('priority')

			if (priorityNode) {
				const priority = priorityNode.textContent

				const priorityNumber = Number(priority)

				if (!priority || typeof priorityNumber !== 'number') {
					if (strict) {
						throw new Error(`Invalid priority value: ${priority}`)
					}
					console.warn(`Skipping priority property due to invalid value: ${priority}`)
				} else if (priorityNumber > 1 || priorityNumber < 0) {
					if (strict) {
						throw new Error(`Invalid priority number: ${priorityNumber}`)
					}
					console.warn(`Skipping priority property due to invalid number: ${priorityNumber}`)
				} else {
					entry.priority = priorityNumber
				}
			}

			entries.push(entry)
		}

		return entries
	}

	const sitemapIndexNode = document.querySelector('sitemapindex')

	if (sitemapIndexNode) {
		const entries: SitemapIndexEntry[] = []

		for (const sitemapNode of <NodeStruct[]>urlSetNode.querySelectorAll('sitemap')) {
			let entry: SitemapIndexEntry

			const locationNode = sitemapNode.querySelector('loc')

			if (!locationNode) {
				if (strict) {
					throw new Error('Missing location node in entry')
				}
				console.warn('Skipping entry due to missing location node')
				continue
			}

			try {
				entry = {
					location: new URL(locationNode.textContent)
				}
			} catch (error) {
				if (strict) {
					throw new Error(`Failed to parse location URL: ${error.message}`)
				}
				console.warn(`Skipping entry due to invalid location URL: ${error.message}`)
				continue
			}

			const lastModifiedNode = locationNode.querySelector('lastmod')

			if (lastModifiedNode) {
				try {
					entry.lastModified = new Date(lastModifiedNode.textContent)
				} catch (error) {
					if (strict) {
						throw new Error(`Failed to parse last modified date: ${error.message}`)
					}
					console.warn(`Skipping lastModified property due to invalid date: ${error.message}`)
				}
			}

			entries.push(entry)
		}

		return entries
	}

	throw new Error('Invalid sitemap')
}
