import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

export const ImageUpload = async (thumbs, folderName) => {
    let thumbPaths = [];

    const uploadDir = path.join(process.cwd(), "public", folderName);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const processImage = async (thumb) => {
        const timestamp = Date.now();
        const originalFileName = thumb.name;
        // Remove the file extension before sanitizing the file name
        const fileBaseName = originalFileName.substring(0, originalFileName.lastIndexOf('.'));

        // Sanitize the file name: remove special characters and replace spaces with underscores
        const sanitizedFileName = fileBaseName
            .replace(/[^a-zA-Z0-9\s]/g, "")  // Remove special characters
            .replace(/\s+/g, "_");            // Replace spaces with underscores

        const fileName = `${timestamp}_${sanitizedFileName}.webp`;

        const filePath = path.join(uploadDir, fileName);
        const fileBuffer = await thumb.arrayBuffer();
        const sharpBuffer = await sharp(Buffer.from(fileBuffer))
            .webp()
            .toBuffer();

        await fs.writeFile(filePath, sharpBuffer);
        return `/${folderName}/${fileName}`;
    };

    if (Array.isArray(thumbs)) {
        for (const thumb of thumbs) {
            const path = await processImage(thumb);
            thumbPaths.push(path);
        }
    } else if (thumbs && thumbs.size > 0) {
        const path = await processImage(thumbs);
        thumbPaths.push(path);
    }

    return thumbPaths.length === 1 ? thumbPaths[0] : thumbPaths;
};
