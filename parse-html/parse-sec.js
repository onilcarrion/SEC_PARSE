"use strict";
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000119312518121161/0001193125-18-121161.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000070/0001018724-18-000070.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000106/0001018724-18-000106.txt';
// const url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000104/0001018724-18-000104.txt';   //(short case (6))
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
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
var axios_1 = require("axios");
var cheerio = require("cheerio");
var fs = require("fs");
var html_entities_1 = require("html-entities");
// URL to fetch
var url = 'https://www.sec.gov/Archives/edgar/data/1018724/000101872418000002/0001018724-18-000002.txt';
// List of User-Agents to rotate
var userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Firefox/89.0',
    // Add more user agents as needed
];
// Define the items to check for
var itemsToCheck = [
    '1.01', '1.03', '2.01', '2.022', '2.03', '2.04',
    '4.01', '4.02', '5.01', '5.02', '7.01', '8.01'
];
function fetchAndParseURL(url) {
    return __awaiter(this, void 0, void 0, function () {
        var maxRetries, attempt, _loop_1, state_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    maxRetries = 10;
                    attempt = 0;
                    _loop_1 = function () {
                        var userAgent, response, data, $, documentText, lines, inRelevantSection, filteredLines, _i, lines_1, line, filteredText_1, anyItemFound_1, sentences, formattedText, outputFileName, error_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 8]);
                                    userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
                                    console.log("Attempt ".concat(attempt + 1, " with User-Agent: ").concat(userAgent));
                                    return [4 /*yield*/, axios_1.default.get(url, {
                                            headers: {
                                                'User-Agent': userAgent
                                            },
                                            timeout: 10000 // Set a timeout to avoid hanging requests
                                        })];
                                case 1:
                                    response = _b.sent();
                                    data = response.data;
                                    // Decode any HTML entities
                                    data = (0, html_entities_1.decode)(data);
                                    $ = cheerio.load(data);
                                    documentText = $('DOCUMENT').text();
                                    lines = documentText.split('\n');
                                    inRelevantSection = false;
                                    filteredLines = [];
                                    // Process each line to determine if it's in a relevant section
                                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                                        line = lines_1[_i];
                                        if (line.startsWith('begin')) {
                                            inRelevantSection = true;
                                        }
                                        else if (line.startsWith('end')) {
                                            if (inRelevantSection) {
                                                inRelevantSection = false;
                                            }
                                        }
                                        else if (!inRelevantSection) {
                                            filteredLines.push(line);
                                        }
                                    }
                                    filteredText_1 = filteredLines.join(' ');
                                    anyItemFound_1 = false;
                                    itemsToCheck.forEach(function (item) {
                                        var itemPattern = new RegExp("ITEM\\s+".concat(item), 'i'); // Regular expression to match 'ITEM item'
                                        if (itemPattern.test(filteredText_1)) {
                                            console.log("Item ".concat(item, " is present in the document."));
                                            anyItemFound_1 = true;
                                        }
                                        else {
                                            console.log("Item ".concat(item, " is NOT present in the document."));
                                        }
                                    });
                                    sentences = filteredText_1.split('.').map(function (sentence) { return sentence.trim() + '.'; });
                                    formattedText = sentences.join('\n');
                                    // Determine if the document should be saved based on the presence of any items
                                    if (anyItemFound_1) {
                                        outputFileName = 'parsed-document.txt';
                                        fs.writeFileSync(outputFileName, formattedText);
                                        console.log("Relevant information has been saved to ".concat(outputFileName));
                                    }
                                    else {
                                        console.log('The document does not contain the required items and will not be saved.');
                                    }
                                    return [2 /*return*/, "break"];
                                case 2:
                                    error_1 = _b.sent();
                                    if (!axios_1.default.isAxiosError(error_1)) return [3 /*break*/, 6];
                                    // Handle AxiosError
                                    console.error('Error fetching or parsing the URL:', error_1.message);
                                    if (!(error_1.response && error_1.response.status === 403)) return [3 /*break*/, 4];
                                    console.log('Received 403 Forbidden error. Trying again...');
                                    attempt++;
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 5000); })];
                                case 3:
                                    _b.sent(); // Wait before retrying
                                    return [3 /*break*/, 5];
                                case 4: return [2 /*return*/, "break"];
                                case 5: return [3 /*break*/, 7];
                                case 6:
                                    // Handle non-Axios errors
                                    console.error('Unexpected error:', error_1);
                                    return [2 /*return*/, "break"];
                                case 7: return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 1;
                case 1:
                    if (!(attempt < maxRetries)) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    state_1 = _a.sent();
                    if (state_1 === "break")
                        return [3 /*break*/, 3];
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
fetchAndParseURL(url);
