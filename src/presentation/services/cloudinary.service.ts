import { v2 as cloudinary } from 'cloudinary';

export class CloudinaryService {

    constructor(

    ) {}

    public async uploadImage( image: string ): Promise<string> {
        
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true
        }

        try {
            const { secure_url } = await cloudinary.uploader.upload(image, options);
            return secure_url;
        } catch (error) {
            console.log('Error al subir a cloudinary')
            console.log(error);
            throw new Error('Error uploading image');
        }
    }
}