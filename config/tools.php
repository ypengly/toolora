<?php

/*
 * Toolora tool registry. Every entry has a matching browser module in
 * resources/js/tools/{slug}.js (enforced by tests/Feature/RegistryTest.php).
 * The seeder copies searchable fields into the database; page content
 * (how-to, FAQs, explanations) is read from here.
 */
return [
    'categories' => [
        'image'     => ['name' => 'Image Tools', 'icon' => 'image', 'description' => 'Compress and convert images in your browser without uploading them.'],
        'developer' => ['name' => 'Developer Tools', 'icon' => 'braces', 'description' => 'Formatters, encoders, generators and testers for everyday development.'],
        'text'      => ['name' => 'Text Tools', 'icon' => 'type', 'description' => 'Count, convert and clean text with live results.'],
        'qr'        => ['name' => 'QR Code Tools', 'icon' => 'qr-code', 'description' => 'Create scannable QR codes for links, Wi-Fi, contacts and more.'],
        'seo'       => ['name' => 'SEO Tools', 'icon' => 'tags', 'description' => 'Generate and preview the tags that describe your pages to search engines.'],
        'everyday'  => ['name' => 'Everyday Utilities', 'icon' => 'calculator', 'description' => 'Calculators and generators for common daily tasks.'],
    ],

    'tools' => [
        'json-formatter' => [
            'category' => 'developer', 'featured' => true, 'icon' => 'braces',
            'name' => 'JSON Formatter & Validator', 'title' => 'JSON Formatter and Validator',
            'description' => 'Format, validate and minify JSON directly in your browser.',
            'keywords' => 'json beautify pretty print lint validate minify parser prettify',
            'howto' => ['Paste or type JSON into the input box, or click Example.', 'Click Format to indent it, Minify to compact it, or Validate to only check syntax.', 'Fix any error shown (with line and column when the browser reports it), then copy or download the result.'],
            'about' => 'JSON (JavaScript Object Notation) is a text format for structured data. It requires double-quoted keys and strings, no trailing commas and no comments. This tool uses the browser\'s built-in JSON parser, so what it accepts is what JSON.parse accepts. Your data is never sent to a server.',
            'faqs' => [
                ['Does my JSON leave my device?', 'No. Parsing and formatting happen entirely in your browser.'],
                ['Why does valid-looking JSON fail?', 'The usual causes are single quotes, trailing commas, unquoted keys or comments. Standard JSON allows none of these.'],
                ['Is there a size limit?', 'There is no fixed limit, but very large documents (tens of megabytes) may slow or freeze your tab.'],
            ],
            'related' => ['base64-encoder-decoder', 'diff-checker', 'url-encoder-decoder'],
        ],
        'image-compressor' => [
            'category' => 'image', 'featured' => true, 'icon' => 'image',
            'name' => 'Image Compressor', 'title' => 'Image Compressor',
            'description' => 'Reduce JPEG, PNG and WebP file sizes in your browser with adjustable quality.',
            'keywords' => 'compress image reduce size optimize jpeg png webp shrink photo',
            'howto' => ['Drop up to 20 images (JPEG, PNG or WebP, 25 MB each) onto the page.', 'Choose an output format and quality. WebP and JPEG give the biggest savings.', 'Review original and new sizes, then download each result.'],
            'about' => 'Lossy formats such as JPEG and WebP shrink files by discarding detail the eye notices least. Lower quality means smaller files and more visible artifacts. PNG is lossless, so the quality slider does not apply to it; converting a PNG to WebP or JPEG is usually how to save space. Images are decoded and re-encoded locally with the browser Canvas API and are not uploaded.',
            'faqs' => [
                ['Can the result be larger than the original?', 'Yes, especially for already-optimized files or when re-saving as PNG. The tool shows the real size change and flags files that grew.'],
                ['Is metadata kept?', 'No. Re-encoding through a canvas drops EXIF data such as camera model and GPS location.'],
                ['Why is WebP unavailable on my browser?', 'Some older browsers cannot encode WebP. The tool detects this and tells you which format was actually produced.'],
            ],
            'related' => ['image-format-converter', 'qr-code-generator', 'base64-encoder-decoder'],
        ],
        'qr-code-generator' => [
            'category' => 'qr', 'featured' => true, 'icon' => 'qr-code',
            'name' => 'QR Code Generator', 'title' => 'QR Code Generator',
            'description' => 'Create QR codes for text, links, Wi-Fi, contacts and email, with PNG and SVG download.',
            'keywords' => 'qr code generator wifi vcard url email barcode scan',
            'howto' => ['Pick what the code should contain: text, URL, Wi-Fi, contact or email.', 'Fill in the fields and choose size, error correction and colors.', 'Test the preview with your phone, then download PNG or SVG.'],
            'about' => 'A QR code stores your text as a pattern of squares. Higher error correction lets a code survive damage but makes it denser. Scanners need strong contrast with a dark foreground on a light background; low-contrast or inverted colors may not scan. Always test a code before printing it. Codes are generated locally and static, so they never expire and are not tracked.',
            'faqs' => [
                ['Will the QR code expire?', 'No. The data is encoded in the image itself, so it works as long as the destination (such as a URL) does.'],
                ['Can I add a logo?', 'This tool does not embed logos. Logos cover modules and can make codes unreadable unless error correction is high and the result is tested.'],
                ['Is my Wi-Fi password sent anywhere?', 'No. The code is generated in your browser.'],
            ],
            'related' => ['url-encoder-decoder', 'meta-tag-generator', 'word-counter'],
        ],
        'word-counter' => [
            'category' => 'text', 'featured' => true, 'icon' => 'type',
            'name' => 'Word Counter', 'title' => 'Word Counter and Character Counter',
            'description' => 'Count words, characters, sentences, lines and reading time as you type.',
            'keywords' => 'word count character counter sentences paragraphs reading time length',
            'howto' => ['Type or paste text into the box.', 'Counts update instantly as you type.', 'Use the reading and speaking time estimates to size an article or speech.'],
            'about' => 'Words are counted as groups of characters separated by whitespace. Sentences are estimated from . ! and ? punctuation, so abbreviations can inflate that number. Reading time assumes about 238 words per minute and speaking time about 130; real speeds vary.',
            'faqs' => [
                ['Is my text stored?', 'No. Counting happens in your browser and nothing is sent or saved.'],
                ['Are spaces included in the character count?', 'Both counts are shown: with spaces and without.'],
            ],
            'related' => ['case-converter', 'diff-checker', 'meta-tag-generator'],
        ],
        'case-converter' => [
            'category' => 'text', 'featured' => false, 'icon' => 'case-sensitive',
            'name' => 'Case Converter', 'title' => 'Case Converter',
            'description' => 'Convert text to upper, lower, title, sentence, camel, snake, kebab and constant case.',
            'keywords' => 'uppercase lowercase title case sentence camelcase snake_case kebab-case constant',
            'howto' => ['Enter your text.', 'Click the case style you need.', 'Copy or download the converted text.'],
            'about' => 'Programming cases (camelCase, snake_case, kebab-case, CONSTANT_CASE) split text into words at spaces, punctuation and lowercase-to-uppercase boundaries, then rejoin them. Title and sentence case follow simple capitalization rules and do not know style-guide exceptions such as small words.',
            'faqs' => [
                ['Does it handle accented letters?', 'Yes, upper and lower casing use Unicode-aware browser functions.'],
                ['Does title case skip small words like "of"?', 'No. Every word is capitalized, so adjust small words manually if your style guide requires it.'],
            ],
            'related' => ['word-counter', 'url-encoder-decoder', 'diff-checker'],
        ],
        'base64-encoder-decoder' => [
            'category' => 'developer', 'featured' => true, 'icon' => 'binary',
            'name' => 'Base64 Encoder & Decoder', 'title' => 'Base64 Encoder and Decoder',
            'description' => 'Encode text to Base64 or decode Base64 back to text, with URL-safe support.',
            'keywords' => 'base64 encode decode atob btoa utf-8 url-safe',
            'howto' => ['Choose Encode or Decode.', 'Paste your input; the result updates live.', 'For URL or JWT-style values, enable URL-safe.'],
            'about' => 'Base64 represents bytes using 64 printable characters. It is an encoding, not encryption: anyone can decode it. Text is converted as UTF-8 so emoji and non-Latin scripts round-trip correctly. URL-safe Base64 swaps + and / for - and _ and omits padding.',
            'faqs' => [
                ['Is Base64 secure?', 'No. It hides nothing. Never use it to protect secrets.'],
                ['Why does decoding fail?', 'The input may contain characters outside the Base64 alphabet, or decode to bytes that are not valid UTF-8 text (for example a binary file).'],
            ],
            'related' => ['url-encoder-decoder', 'json-formatter', 'image-compressor'],
        ],
        'url-encoder-decoder' => [
            'category' => 'developer', 'featured' => false, 'icon' => 'link',
            'name' => 'URL Encoder & Decoder', 'title' => 'URL Encoder and Decoder',
            'description' => 'Percent-encode or decode URLs and query values.',
            'keywords' => 'url encode decode percent encoding uri component query string',
            'howto' => ['Pick a mode: encode a value, encode a full URL, or decode.', 'Paste your text.', 'Copy the result.'],
            'about' => 'Percent-encoding replaces unsafe characters with % and two hex digits. "Encode value" (encodeURIComponent) escapes everything that has meaning in a URL, so use it for a single query parameter. "Encode full URL" (encodeURI) keeps characters such as : / ? & # intact so a complete address still works.',
            'faqs' => [
                ['Which mode should I use for a query parameter?', 'Encode value. Using full-URL mode leaves & and = unescaped, which can break the query string.'],
                ['Why does decoding show an error?', 'A % sign must be followed by two hex digits. A stray % makes the input malformed.'],
            ],
            'related' => ['base64-encoder-decoder', 'qr-code-generator', 'json-formatter'],
        ],
        'uuid-generator' => [
            'category' => 'developer', 'featured' => false, 'icon' => 'fingerprint',
            'name' => 'UUID Generator', 'title' => 'UUID v4 Generator',
            'description' => 'Generate random version 4 UUIDs in bulk using your browser\'s secure random source.',
            'keywords' => 'uuid guid generator v4 random unique id identifier',
            'howto' => ['Choose how many UUIDs (1 to 1000).', 'Optionally use uppercase or remove hyphens.', 'Click Generate, then copy or download.'],
            'about' => 'A version 4 UUID is 122 random bits formatted as 8-4-4-4-12 hexadecimal digits. Collisions are astronomically unlikely, but UUIDs are identifiers, not secrets: do not use them as passwords or access tokens unless your security model says so.',
            'faqs' => [
                ['Are these cryptographically random?', 'They come from crypto.randomUUID or crypto.getRandomValues, the browser\'s secure generators.'],
                ['Are UUIDs generated here stored?', 'No. They exist only on your screen.'],
            ],
            'related' => ['password-generator', 'base64-encoder-decoder', 'unix-timestamp-converter'],
        ],
        'password-generator' => [
            'category' => 'everyday', 'featured' => true, 'icon' => 'key-round',
            'name' => 'Password Generator', 'title' => 'Secure Password Generator',
            'description' => 'Generate strong random passwords locally with cryptographically secure randomness.',
            'keywords' => 'password generator random secure strong passphrase symbols',
            'howto' => ['Set the length and character types.', 'Click Generate for a new password.', 'Copy it straight into a password manager.'],
            'about' => 'Passwords here are built from crypto.getRandomValues with rejection sampling, so every character is chosen uniformly. The bit estimate is length x log2(pool size), assuming a truly random password. Length matters more than symbols. A password manager lets you use a unique password per site.',
            'faqs' => [
                ['Is the password stored or sent anywhere?', 'No. It exists only in this page and disappears when you leave or regenerate.'],
                ['Is this the same as password hashing?', 'No. This creates passwords. Hashing is what a website does to store them safely.'],
            ],
            'related' => ['uuid-generator', 'base64-encoder-decoder', 'percentage-calculator'],
        ],
        'percentage-calculator' => [
            'category' => 'everyday', 'featured' => false, 'icon' => 'percent',
            'name' => 'Percentage Calculator', 'title' => 'Percentage Calculator',
            'description' => 'Find a percentage of a number, what percent one number is of another, and percent change.',
            'keywords' => 'percentage calculator percent of change increase decrease discount',
            'howto' => ['Use the card that matches your question.', 'Enter the two numbers; results appear instantly.', 'Check the formula shown under each result.'],
            'about' => 'Percent change is (new - old) / |old| x 100. It is undefined when the starting value is zero, and the tool says so instead of showing a misleading number. Results are rounded to six decimal places.',
            'faqs' => [
                ['How do I calculate a discount?', 'Use "What is X% of Y" for the discount amount, then subtract it from the price.'],
                ['Why does it say undefined?', 'Dividing by zero has no valid result, so a zero base value cannot produce a percentage.'],
            ],
            'related' => ['password-generator', 'unix-timestamp-converter', 'word-counter'],
        ],
        'image-format-converter' => [
            'category' => 'image', 'featured' => true, 'icon' => 'file-image',
            'name' => 'Image Format Converter', 'title' => 'Image Format Converter (PNG, JPG, WebP)',
            'description' => 'Convert images between PNG, JPEG and WebP locally in your browser.',
            'keywords' => 'convert image png jpg jpeg webp format converter transparency',
            'howto' => ['Drop one or more PNG, JPEG or WebP images.', 'Choose the target format and quality.', 'Download each converted file.'],
            'about' => 'JPEG has no transparency, so transparent areas are filled with white when converting to JPEG. PNG is lossless and often larger than JPEG or WebP for photos. Conversion decodes and re-encodes the image locally using canvas; EXIF metadata is not preserved.',
            'faqs' => [
                ['Can I convert HEIC or GIF?', 'Not in this version. Only JPEG, PNG and WebP inputs are supported, and unsupported files show a clear error.'],
                ['Are my images uploaded?', 'No. Everything is processed in your browser.'],
            ],
            'related' => ['image-compressor', 'qr-code-generator', 'base64-encoder-decoder'],
        ],
        'meta-tag-generator' => [
            'category' => 'seo', 'featured' => false, 'icon' => 'tags',
            'name' => 'Meta Tag Generator', 'title' => 'Meta Tag Generator with Search Preview',
            'description' => 'Generate title, description, canonical, Open Graph and Twitter tags with a snippet preview.',
            'keywords' => 'meta tags generator seo title description open graph twitter card canonical robots',
            'howto' => ['Enter your page title and description.', 'Add the canonical URL and optional social image.', 'Copy the generated tags into your page head.'],
            'about' => 'This tool runs entirely in your browser and only builds markup from what you type. It does not fetch your site, check indexing or measure rankings. The preview approximates a search result; search engines may rewrite titles and descriptions. Common guidance is about 60 characters for titles and 155 for descriptions, but pixel width is what is truncated.',
            'faqs' => [
                ['Will these tags improve my ranking?', 'Good titles and descriptions help users choose your result, but no tag guarantees ranking.'],
                ['Does it check my live page?', 'No. It generates tags from your input only.'],
            ],
            'related' => ['word-counter', 'url-encoder-decoder', 'qr-code-generator'],
        ],
        'regex-tester' => [
            'category' => 'developer', 'featured' => true, 'icon' => 'regex',
            'name' => 'Regex Tester', 'title' => 'Regex Tester (JavaScript)',
            'description' => 'Test JavaScript regular expressions with live match highlighting and capture groups.',
            'keywords' => 'regex regexp regular expression tester match groups flags',
            'howto' => ['Enter a pattern without slashes and choose flags.', 'Type or paste the text to test.', 'Review highlighted matches and capture groups.'],
            'about' => 'This uses the JavaScript RegExp engine, so syntax follows ECMAScript and may differ from PCRE, Python or .NET. Patterns with nested quantifiers can backtrack catastrophically and freeze the tab; if that happens, close it and simplify the pattern. Results are capped at 1,000 matches.',
            'faqs' => [
                ['Which regex flavor is this?', 'JavaScript (ECMAScript). Lookbehind and named groups work in modern browsers.'],
                ['Why is the g flag always on?', 'The tester lists every match, so it always searches globally.'],
            ],
            'related' => ['diff-checker', 'json-formatter', 'word-counter'],
        ],
        'diff-checker' => [
            'category' => 'developer', 'featured' => false, 'icon' => 'git-compare',
            'name' => 'Diff Checker', 'title' => 'Diff Checker (Compare Text)',
            'description' => 'Compare two texts line by line and see what was added or removed.',
            'keywords' => 'diff compare text difference checker changes lines',
            'howto' => ['Paste the original text on the left and the changed text on the right.', 'Optionally ignore case or extra whitespace.', 'Click Compare to see additions and removals.'],
            'about' => 'The comparison finds the longest common subsequence of lines, then marks lines only in the original as removed and lines only in the new text as added. It is line-based, so a small change inside a long line marks the whole line. Very large inputs are rejected to protect your browser.',
            'faqs' => [
                ['Is my text uploaded?', 'No. The comparison runs locally.'],
                ['How large can the inputs be?', 'Roughly 3,000 differing lines per side. Identical start and end lines are skipped first.'],
            ],
            'related' => ['json-formatter', 'regex-tester', 'word-counter'],
        ],
        'unix-timestamp-converter' => [
            'category' => 'developer', 'featured' => false, 'icon' => 'clock',
            'name' => 'Unix Timestamp Converter', 'title' => 'Unix Timestamp Converter',
            'description' => 'Convert Unix timestamps to readable dates and dates back to timestamps.',
            'keywords' => 'unix timestamp epoch converter date time seconds milliseconds utc',
            'howto' => ['Paste a timestamp to see its UTC and local date.', 'Or enter a date such as 2026-01-31T12:00:00Z to get its timestamp.', 'Use the live clock for the current time.'],
            'about' => 'A Unix timestamp counts seconds since 1970-01-01 00:00:00 UTC. The tool guesses the unit from magnitude: seconds, milliseconds, microseconds or nanoseconds. Dates without a time zone are interpreted in your local time zone, so add Z or an offset for UTC.',
            'faqs' => [
                ['How does it know seconds from milliseconds?', 'Values of 100 billion or more are treated as milliseconds (or finer). Check the detected unit shown with the result.'],
                ['Does it handle the year 2038 problem?', 'JavaScript dates are 64-bit floating point, so dates beyond 2038 convert correctly here.'],
            ],
            'related' => ['uuid-generator', 'json-formatter', 'percentage-calculator'],
        ],
    ],
];
