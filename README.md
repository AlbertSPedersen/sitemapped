# Sitemapped

A simple sitemap parser for Web Workers.

```js
import { parseSitemap } from 'sitemapped'

const response = await fetch('https://developers.cloudflare.com/sitemap.xml')

const text = await response.text()

const entries = parseSitemap(text)

console.log(entries)
```

```json
[
	{
		"location": "https://developers.cloudflare.com/logs/faq/general-faq/",
		"lastModified": "2023-05-29T09:49:58.000Z",
		"changeFrequency": "daily",
		"priority": 0.7
	}
]
```
