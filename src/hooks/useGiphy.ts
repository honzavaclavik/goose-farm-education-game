import { useMemo } from 'react';

const GIF_URLS = [
  'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHc4b3BhNmo5a3k4NWVmZWhndTk0bDRyYTQ3YjhuNzV1cXU3aXZnYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8o2L898vTXUITi87aJ/giphy.gif',
  'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExemR6NmRuYjA5bGhpbzdxbWt3NGVkOXYwa2Excjdqamo0NWNqaWIxZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Hc8PMCBjo9BXa/giphy.gif',
  'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZThsZjZlZ2k0eXBpaTJ0YTc5MGNhcmU0NmptMmlrNm9qdWlmN3AwcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GBhju13tiVB60/giphy.gif',
  'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHQzZHJrbWt2MnMyanNmZnU2eHhycG4zbzh4emMyNjdmMGcxbXZpdCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pY8jLmZw0ElqvVeRH4/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGI2aHppenN2bW50d2ZuYWJpdmxvd2c3YnF1cDl1NGpxaGl6YTQzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/12HZukMBlutpoQ/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGI2aHppenN2bW50d2ZuYWJpdmxvd2c3YnF1cDl1NGpxaGl6YTQzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/sEz6uZKCdNk6OzkfFt/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGI2aHppenN2bW50d2ZuYWJpdmxvd2c3YnF1cDl1NGpxaGl6YTQzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Hmxh5TkEK2wv9chXfR/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGI2aHppenN2bW50d2ZuYWJpdmxvd2c3YnF1cDl1NGpxaGl6YTQzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/pAHAgWYYjWIE9DNLcC/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGI2aHppenN2bW50d2ZuYWJpdmxvd2c3YnF1cDl1NGpxaGl6YTQzbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gm3Z05VsyZsFG/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzJxOW5jOTdyODd0YzRzYm5wbHN2Mm53ZW04NDRqNzN2cTczZW14ZiZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/Z1kpfgtHmpWHS/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmRlbWxhdzY2N2t4czFvYm1oNDhzODN3b2E5dTdpMWdtcngyZzdqZyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/ccrcr48B8yhAQ/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmRlbWxhdzY2N2t4czFvYm1oNDhzODN3b2E5dTdpMWdtcngyZzdqZyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/jTnGaiuxvvDNK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmRlbWxhdzY2N2t4czFvYm1oNDhzODN3b2E5dTdpMWdtcngyZzdqZyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/rgAd7jWyJyo8M/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmRlbWxhdzY2N2t4czFvYm1oNDhzODN3b2E5dTdpMWdtcngyZzdqZyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/tBxyh2hbwMiqc/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bDNqODdzOWJwbDlhbndiYnlwY2x2ZW5oMHExbXh4Mzh2Yjc2MGF3OSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/FG6EQNhs3s7ug/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YzJxOW5jOTdyODd0YzRzYm5wbHN2Mm53ZW04NDRqNzN2cTczZW14ZiZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/5aCiXMnPl1cli/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dmRlbWxhdzY2N2t4czFvYm1oNDhzODN3b2E5dTdpMWdtcngyZzdqZyZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/6bAZXey5wNzBC/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3bDNqODdzOWJwbDlhbndiYnlwY2x2ZW5oMHExbXh4Mzh2Yjc2MGF3OSZlcD12MV9naWZzX3JlbGF0ZWQmY3Q9Zw/P00SPqP9mGAMw/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/9jVlopxVjDl1NXwkZK/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/S2S0ZDytY6yDm/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XN8YOV0H6YfVFFGxth/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/8lgqAbycBjosxjfi9k/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cYZkY9HeKgofpQnOUl/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/gKHGnB1ml0moQdjhEJ/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjN3eTVyYWZzMG1naTN0M2oxbXN5ZXkzbnIzaG1pMzZuNjBiZjF4eCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/exUgjvyJF451IGaRpH/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3YXkwcDdtdmg5cmh6bm9xZDRncDdwNDJhNWgxbW40bm1zamNuc2x5bSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/S9uH1icPbUofFtQFkA/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3anVycjNzM2QyeTFoYzNrejhvZHk2bW90ZG5yNHB4d2kzbm9na2o0OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GSsTZNQjPvl1m/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjgxbXBlMnNtZGMxdTFpNzJzYTNqNHN0a3h5NG1ldDRzY2gzbDVqeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/YMXs9AzIHR5IGR9i4t/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMjgxbXBlMnNtZGMxdTFpNzJzYTNqNHN0a3h5NG1ldDRzY2gzbDVqeiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/zTGe1PpsM4WlCL3D5u/giphy.gif',
  'https://media.giphy.com/media/v1.Y2lkPWVjZjA1ZTQ3dnlhYjJuc3p4ODNxbmdieW10MzFlcGJzNmtqcXBxamVkMmtmN3BjMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/T7nRl5WHw7Yru/giphy.gif',
];

let lastIndex = -1;

/** Returns a random GIF URL from the curated list, avoiding repeats */
export function getRandomGifUrl(): string {
  let index: number;
  do {
    index = Math.floor(Math.random() * GIF_URLS.length);
  } while (index === lastIndex && GIF_URLS.length > 1);
  lastIndex = index;
  return GIF_URLS[index];
}

/** Hook that returns a random GIF URL (stable per mount, changes with key) */
export function useRandomGif(): string {
  return useMemo(() => getRandomGifUrl(), []);
}
