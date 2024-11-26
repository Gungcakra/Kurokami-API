import axios from "axios";

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
  "Mozilla/5.0 (Linux; Android 10; Pixel 3 XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Mobile Safari/537.36",
  
];

const getRandomUserAgent = () => {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
};

const headers = {
  "User-Agent": getRandomUserAgent(),
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
  "Referer": "https://komikstation.co/",
  "Origin": "https://komikstation.co",
  "X-Requested-With": "XMLHttpRequest",  
  "Upgrade-Insecure-Requests": "1",  
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchPage = async (url, config = {}) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": getRandomUserAgent(),
        ...headers,
        ...config.headers,
      },
      ...config,
    });

    // console.log("Response Headers:", response.headers);

    await delay(1000);
    return response.data;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`, error.message);
    console.error("Error Response Headers:", error.response?.headers);
    throw error;
  }
};

export const fetchWithRetry = async (url, config, retryConfig) => {
  const { retries = 3, delay = 3000 } = retryConfig || {};

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchPage(url, config);
    } catch (error) {
      console.error(`Attempt ${attempt} failed: ${url}`, error.message);

      if (attempt === retries) throw error;

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export const getFinalUrl = async (url, config) => {
  try {
    const response = await axios.head(url, {
      headers: {
        "User-Agent": getRandomUserAgent(),
        ...headers,
        ...config.headers,
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    return response.headers.location || url;
  } catch (error) {
    console.error(`Error getting final URL: ${url}`, error.message);
    throw error;
  }
};
