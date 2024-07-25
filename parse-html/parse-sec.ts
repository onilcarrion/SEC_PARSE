// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000119312518121161/0001193125-18-121161.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000070/0001018724-18-000070.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000106/0001018724-18-000106.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000104/0001018724-18-000104.txt';   //(short case (6))


// import axios, { AxiosError } from 'axios';
// import * as cheerio from 'cheerio';
// import * as fs from 'fs';
// import { decode } from 'html-entities';

// // URL to fetch
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000002/0001018724-18-000002.txt';

// // List of User-Agents to rotate
// const userAgents = [
//     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
//     // Add more user agents as needed
// ];

// async function fetchAndParseURL(url: string): Promise<void> {
//     const maxRetries = 3;
//     let attempt = 0;

//     while (attempt < maxRetries) {
//         try {
//             // Randomly select a User-Agent
//             const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
//             console.log(`Attempt ${attempt + 1} with User-Agent: ${userAgent}`);

//             // Fetch the URL content with the selected User-Agent
//             const response = await axios.get(url, {
//                 headers: {
//                     'User-Agent': userAgent
//                 },
//                 timeout: 10000 // Set a timeout to avoid hanging requests
//             });

//             let data = response.data;

//             // Decode any HTML entities
//             data = decode(data);

//             // Load the data into cheerio for parsing
//             const $ = cheerio.load(data);

//             // Extract text between <DOCUMENT> and </DOCUMENT> tags
//             const documentText = $('DOCUMENT').text();

//             // Split the text into lines
//             const lines = documentText.split('\n');

//             // Initialize flags and storage for filtered content
//             let inRelevantSection = false;
//             let filteredLines: string[] = [];

//             // Process each line
//             for (const line of lines) {
//                 if (line.startsWith('begin')) {
//                     inRelevantSection = true;
//                 } else if (line.startsWith('end')) {
//                     if (inRelevantSection) {
//                         // End of a relevant section
//                         inRelevantSection = false;
//                     }
//                 } else if (!inRelevantSection) {
//                     // Add lines to filteredLines if not in a relevant section
//                     filteredLines.push(line);
//                 }
//             }

//             // Join the filtered lines
//             const filteredText = filteredLines.join(' ');

//             // Filter out irrelevant lines (non-printable and special characters)
//             const relevantLines = filteredText.split('\n').filter(line => {
//                 // Remove non-printable and special characters
//                 const cleanedLine = line.replace(/[^\x20-\x7E]/g, '');
//                 const alphanumericLine = cleanedLine.replace(/[^a-zA-Z0-9\s.]/g, ''); // Remove remaining non-alphanumeric characters
//                 const alphanumericRatio = alphanumericLine.replace(/\s+/g, '').length / line.length;
//                 return alphanumericRatio > 0.7; // Keep lines with more than 70% alphanumeric characters
//             });

//             // Join the filtered lines
//             const cleanFilteredText = relevantLines.join(' ');

//             // Split the text into sentences based on periods
//             const sentences = cleanFilteredText.split('.').map(sentence => sentence.trim() + '.');

//             // Join the sentences back together with newlines for readability
//             const formattedText = sentences.join('\n');

//             // Save the formatted text to a new file
//             const outputFileName = 'parsed-document.txt';
//             fs.writeFileSync(outputFileName, formattedText);

//             console.log(`Relevant information has been saved to ${outputFileName}`);
//             break; // Exit the loop if successful
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 // Handle AxiosError
//                 console.error('Error fetching or parsing the URL:', error.message);

//                 if (error.response && error.response.status === 403) {
//                     console.log('Received 403 Forbidden error. Trying again...');
//                     attempt++;
//                     await new Promise(resolve => setTimeout(resolve, 5000)); // Wait before retrying
//                 } else {
//                     // Handle other Axios errors
//                     break; // Exit the loop for other errors
//                 }
//             } else {
//                 // Handle non-Axios errors
//                 console.error('Unexpected error:', error);
//                 break; // Exit the loop for unexpected errors
//             }
//         }
//     }
// }

// fetchAndParseURL(url);

import axios, { AxiosError } from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { decode } from 'html-entities';

// URL to fetch
const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000002/0001018724-18-000002.txt';

// List of User-Agents to rotate
const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
    // Add more user agents as needed
];

// Define the items to check for
const itemsToCheck = [
    '1.01', '1.03', '2.01', '2.022', '2.03', '2.04', 
    '4.01', '4.02', '5.01', '5.02', '7.01', '8.01'
];

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

            // Split the text into sentences based on periods
            const sentences = filteredText.split('.').map(sentence => sentence.trim() + '.');

            // Join the sentences back together with newlines for readability
            const formattedText = sentences.join('\n');

            // Determine if the document should be saved based on the presence of any items
            if (anyItemFound) {
                // Save the formatted text to a new file
                const outputFileName = 'parsed-document.txt';
                fs.writeFileSync(outputFileName, formattedText);
                console.log(`Relevant information has been saved to ${outputFileName}`);
            } else {
                console.log('The document does not contain the required items and will not be saved.');
            }

            break; // Exit the loop if successful
        } catch (error) {
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
                console.error('Unexpected error:', error);
                break; // Exit the loop for unexpected errors
            }
        }
    }
}

fetchAndParseURL(url);

