
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { decode } from 'html-entities';

// URL to fetch
//const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000002/0001018724-18-000002.txt';
const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000119312517374998/0001193125-17-374998.txt';

// List of User-Agents to rotate
const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
    // Add more user agents as needed
];

// Define the items to check for
const itemsToCheck = [
    '1.01', '1.03', '2.01', '2.02', '2.03', '2.04', 
    '4.01', '4.02', '5.01', '5.02', '7.01', '8.01'
];

// Summarization API endpoint
const apiUrl = 'https://api.owlin.ai/v2/complete/text';

// API Key (replace with your actual API key)
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiODlhZTcxOTYtMTMzYS00YmQ3LWE0MTgtNmVmMmI2Y2MxYzA4IiwiYXNfc2NvcGUiOiJvd2xpbl9lbXBsb3llZSIsImlhdCI6MTcyMTIxNTUwNCwiZXhwIjoxNzIzODkzOTA0fQ.p-ZUSiFMyRcDXtZutR4rIfujD2mCRQNELqQHMSfOl6E';

async function summarizeText(text: string): Promise<string> {
    try {
        const response = await axios.post(apiUrl, {
            instructions: 'Summarize the following 8-K filing. Include key details and main events, but keep the summary concise.', 
            examples: [],  // Keep empty if no examples are needed
            input: text
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });

        // Log the entire response for inspection
        console.log('API Response:', response.data);

        if (response.data && response.data.completion) {
            return response.data.completion;
        } else {
            return 'Summary not available';
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Error summarizing text:', error.response ? error.response.data : error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response headers:', error.response.headers);
            }
        } else {
            console.error('Unexpected error:', error instanceof Error ? error.message : 'Unknown error');
        }
        throw error;
    }
}

async function fetchAndParseURL(url: string): Promise<void> {
    const maxRetries = 10;
    let attempt = 0;

    while (attempt < maxRetries) {
        try {
            // Randomly select a User-Agent
            const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
            console.log(`Attempt ${attempt + 1} with User-Agent: ${userAgent}`);

            // Fetch the URL content with the selected User-Agent
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': userAgent
                },
                timeout: 10000 // Set a timeout to avoid hanging requests
            });

            let data = response.data;

            // Decode any HTML entities
            data = decode(data);

            // Load the data into cheerio for parsing
            const $ = cheerio.load(data);

            // Extract text between <DOCUMENT> and </DOCUMENT> tags
            const documentText = $('DOCUMENT').text();

            // Check if the documentText is empty
            if (!documentText.trim()) {
                console.log('No relevant content found in the document.');
                break;
            }

            // Split the text into lines
            const lines = documentText.split('\n');

            // Initialize flags and storage for filtered content
            let inRelevantSection = false;
            let filteredLines: string[] = [];

            // Process each line to determine if it's in a relevant section
            for (const line of lines) {
                if (line.startsWith('begin')) {
                    inRelevantSection = true;
                } else if (line.startsWith('end')) {
                    if (inRelevantSection) {
                        inRelevantSection = false;
                    }
                } else if (!inRelevantSection) {
                    filteredLines.push(line);
                }
            }

            // Join the filtered lines
            const filteredText = filteredLines.join(' ');

            // Check for relevant items within the context of 'ITEM'
            let anyItemFound = false;
            itemsToCheck.forEach(item => {
                const itemPattern = new RegExp(`ITEM\\s+${item}`, 'i'); // Regular expression to match 'ITEM item'
                if (itemPattern.test(filteredText)) {
                    console.log(`Item ${item} is present in the document.`);
                    anyItemFound = true;
                } else {
                    console.log(`Item ${item} is NOT present in the document.`);
                }
            });

            if (!anyItemFound) {
                console.log('No relevant items found. Exiting.');
                break;
            }

            // Split the text into sentences based on periods
            const sentences = filteredText.split('.').map(sentence => sentence.trim() + '.');

            // Join the sentences back together with newlines for readability
            const formattedText = sentences.join('\n');

            // Debugging: Check the content of formattedText
            console.log('Formatted Text Length:', formattedText.length);
            console.log('Formatted Text Preview:', formattedText.slice(0, 200)); // Preview first 200 characters

            // Save the formatted text to a new file
            const outputFileName = 'parsed-document.txt';
            fs.writeFileSync(outputFileName, formattedText);
            console.log(`Relevant information has been saved to ${outputFileName}`);

            // Summarize the parsed document
            const summary = await summarizeText(formattedText);

            // Debugging: Check the content of the summary
            console.log('Summary Length:', summary.length);
            console.log('Summary Preview:', summary.slice(0, 200)); // Preview first 200 characters

            // Save the summary to a new file
            const summaryFileName = 'summary.txt';
            fs.writeFileSync(summaryFileName, summary);
            console.log(`Summary has been saved to ${summaryFileName}`);

            break; // Exit the loop if successful
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                // Handle AxiosError
                console.error('Error fetching or parsing the URL:', error.message);

                if (error.response && error.response.status === 403) {
                    console.log('Received 403 Forbidden error. Trying again...');
                    attempt++;
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
                } else {
                    // Handle other Axios errors
                    break; // Exit the loop for other errors
                }
            } else {
                // Handle non-Axios errors
                console.error('Unexpected error:', error instanceof Error ? error.message : 'Unknown error');
                break; // Exit the loop for unexpected errors
            }
        }
    }
}
fetchAndParseURL(url);








