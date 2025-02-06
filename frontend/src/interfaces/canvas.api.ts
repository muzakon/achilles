export interface GenerateImage {
    prompt: string;
    "seed": number;
    "numImages": number;
    "imageSize": string;
    "selectedModel": string;
}